import json, os, time, uuid, hashlib, hmac, jwt
import stripe
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float, DateTime, UniqueConstraint, func, select
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from .curriculum import TRACKS, LESSON
from .grader import TASKS, grade

SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
COURSE_PRICE_PAISE = 1_000_000
engine = create_engine(os.getenv("DATABASE_URL", "sqlite:///./dataverse.db"))
SessionLocal = sessionmaker(engine); Base = declarative_base()

class User(Base):
    __tablename__="users"; id=Column(Integer,primary_key=True); email=Column(String,unique=True,index=True)
    name=Column(String); pw=Column(String); role=Column(String,default="learner")
class Attempt(Base):
    __tablename__="attempts"; id=Column(Integer,primary_key=True); user_id=Column(Integer,index=True)
    task_id=Column(String,index=True); query=Column(String); passed=Column(Boolean); score=Column(Float); at=Column(DateTime,server_default=func.now())
class Certificate(Base):
    __tablename__="certificates"; id=Column(String,primary_key=True); user_id=Column(Integer); track=Column(String); issued=Column(DateTime,server_default=func.now())
class BillingOrder(Base):
    __tablename__="billing_orders"
    id=Column(String,primary_key=True); user_id=Column(Integer,index=True); courses=Column(String)
    amount_paise=Column(Integer); stripe_session_id=Column(String,unique=True,index=True)
    status=Column(String,default="pending"); created=Column(DateTime,server_default=func.now())
class Enrollment(Base):
    __tablename__="enrollments"
    id=Column(Integer,primary_key=True); user_id=Column(Integer,index=True); track=Column(String)
    order_id=Column(String); enrolled=Column(DateTime,server_default=func.now())
    __table_args__=(UniqueConstraint("user_id","track",name="uq_enrollment_user_track"),)
Base.metadata.create_all(engine)

app = FastAPI(title="DataVerse AI Academy"); bearer = HTTPBearer()
def db():
    s = SessionLocal()
    try: yield s
    finally: s.close()
def hash_pw(p, salt=None):
    salt = salt or os.urandom(8).hex(); return salt+"$"+hashlib.pbkdf2_hmac("sha256",p.encode(),salt.encode(),120000).hex()
def check_pw(p, h): return hmac.compare_digest(hash_pw(p, h.split("$")[0]), h)
def token(uid): return jwt.encode({"sub":str(uid),"exp":time.time()+86400}, SECRET, "HS256")
def me(cred=Depends(bearer), s: Session=Depends(db)):
    try: uid = int(jwt.decode(cred.credentials, SECRET, ["HS256"])["sub"])
    except Exception: raise HTTPException(401,"Invalid token")
    u = s.get(User, uid)
    if not u: raise HTTPException(401,"Unknown user")
    return u

class Reg(BaseModel): email:str; name:str; password:str
class Login(BaseModel): email:str; password:str
class Sub(BaseModel): task_id:str; query:str
class Checkout(BaseModel): courses:list[str]

def stripe_client():
    if not STRIPE_SECRET_KEY:
        raise HTTPException(503,"Payments are not configured. Contact the academy administrator.")
    stripe.api_key = STRIPE_SECRET_KEY
    return stripe

def fulfill_order(checkout_session, s:Session):
    metadata = getattr(checkout_session,"metadata",None) or {}
    order_id = metadata.get("order_id")
    order = s.get(BillingOrder, order_id) if order_id else None
    if not order or order.stripe_session_id != checkout_session.id:
        raise HTTPException(400,"Checkout session is not associated with an order.")
    if (checkout_session.client_reference_id != str(order.user_id)
        or checkout_session.currency != "inr"
        or checkout_session.amount_total != order.amount_paise):
        raise HTTPException(400,"Checkout payment details do not match the order.")
    if checkout_session.payment_status != "paid":
        return order
    for slug in json.loads(order.courses):
        if not s.scalar(select(Enrollment.id).where(Enrollment.user_id==order.user_id,Enrollment.track==slug)):
            s.add(Enrollment(user_id=order.user_id,track=slug,order_id=order.id))
    order.status="paid"
    s.commit()
    return order

def require_enrollment(u:User,slug:str,s:Session):
    if not s.scalar(select(Enrollment.id).where(Enrollment.user_id==u.id,Enrollment.track==slug)):
        raise HTTPException(403,"Paid course enrollment is required.")

@app.post("/auth/register")
def register(r:Reg, s:Session=Depends(db)):
    if len(r.password)<8: raise HTTPException(422,"Password must be 8+ characters")
    if s.scalar(select(User).where(User.email==r.email.lower())): raise HTTPException(409,"Email exists")
    u=User(email=r.email.lower(),name=r.name,pw=hash_pw(r.password)); s.add(u); s.commit()
    return {"token":token(u.id)}
@app.post("/auth/login")
def login(r:Login, s:Session=Depends(db)):
    u=s.scalar(select(User).where(User.email==r.email.lower()))
    if not u or not check_pw(r.password,u.pw): raise HTTPException(401,"Bad credentials")
    return {"token":token(u.id)}

@app.get("/billing/catalog")
def billing_catalog():
    return {"currency":"INR","courses":[
        {"slug":slug,"title":title,"amount_paise":COURSE_PRICE_PAISE}
        for slug,(title,_) in TRACKS.items()
    ]}
@app.get("/billing/enrollments")
def enrollments(u:User=Depends(me),s:Session=Depends(db)):
    rows=s.scalars(select(Enrollment.track).where(Enrollment.user_id==u.id).order_by(Enrollment.enrolled)).all()
    return {"courses":rows}
@app.post("/billing/checkout")
def create_checkout(x:Checkout,u:User=Depends(me),s:Session=Depends(db)):
    slugs=list(dict.fromkeys(x.courses))
    if not slugs:
        raise HTTPException(422,"Select at least one course.")
    unknown=[slug for slug in slugs if slug not in TRACKS]
    if unknown:
        raise HTTPException(422,"One or more selected courses are not available.")
    already=s.scalars(select(Enrollment.track).where(Enrollment.user_id==u.id,Enrollment.track.in_(slugs))).all()
    if already:
        raise HTTPException(409,f"Already enrolled in: {', '.join(already)}")
    client=stripe_client()
    order=BillingOrder(id=uuid.uuid4().hex,user_id=u.id,courses=json.dumps(slugs),
        amount_paise=COURSE_PRICE_PAISE*len(slugs),status="pending")
    s.add(order); s.commit()
    try:
        checkout_session=client.checkout.Session.create(
            mode="payment",
            client_reference_id=str(u.id),
            customer_email=u.email,
            metadata={"order_id":order.id},
            line_items=[{
                "quantity":1,
                "price_data":{
                    "currency":"inr",
                    "unit_amount":COURSE_PRICE_PAISE,
                    "product_data":{"name":TRACKS[slug][0],"description":"One-time course enrollment"},
                },
            } for slug in slugs],
            success_url=f"{FRONTEND_URL}/checkout?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/checkout?cancelled=1",
            idempotency_key=order.id,
        )
    except stripe.StripeError as exc:
        order.status="failed"; s.commit()
        raise HTTPException(502,"Could not start secure checkout. Please try again.") from exc
    order.stripe_session_id=checkout_session.id
    s.commit()
    return {"url":checkout_session.url}
@app.get("/billing/checkout/{session_id}")
def checkout_status(session_id:str,u:User=Depends(me),s:Session=Depends(db)):
    order=s.scalar(select(BillingOrder).where(BillingOrder.stripe_session_id==session_id))
    if not order or order.user_id!=u.id:
        raise HTTPException(404,"Checkout session not found.")
    client=stripe_client()
    try:
        checkout_session=client.checkout.Session.retrieve(session_id)
    except stripe.StripeError as exc:
        raise HTTPException(502,"Could not verify checkout with Stripe. Please try again.") from exc
    order=fulfill_order(checkout_session,s)
    return {"status":order.status,"courses":json.loads(order.courses)}
@app.post("/billing/webhook")
async def stripe_webhook(request:Request,s:Session=Depends(db)):
    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(503,"Payment webhook is not configured.")
    signature=request.headers.get("stripe-signature")
    if not signature:
        raise HTTPException(400,"Missing Stripe signature.")
    payload=await request.body()
    try:
        event=stripe.Webhook.construct_event(payload,signature,STRIPE_WEBHOOK_SECRET)
    except (ValueError,stripe.SignatureVerificationError) as exc:
        raise HTTPException(400,"Invalid Stripe webhook signature or payload.") from exc
    if event.type in ("checkout.session.completed","checkout.session.async_payment_succeeded"):
        fulfill_order(event.data.object,s)
    return {"received":True}

@app.get("/tracks")
def tracks(): return [{"slug":k,"title":v[0],"modules":len(v[1])} for k,v in TRACKS.items()]
@app.get("/tracks/{slug}")
def track(slug:str):
    if slug not in TRACKS: raise HTTPException(404)
    t,m=TRACKS[slug]
    return {"title":t,"modules":[{"n":i+1,"title":x,"content_status":"available" if slug=="data-analytics" and i==1 else "planned"} for i,x in enumerate(m)]}
@app.get("/lessons/sql-fundamentals")
def lesson(): return LESSON
@app.get("/labs/tasks")
def tasks(u:User=Depends(me),s:Session=Depends(db)):
    require_enrollment(u,"data-analytics",s)
    return [{"id":k,"prompt":v["prompt"]} for k,v in TASKS.items()]
@app.post("/labs/sql/submit")
def submit(x:Sub, u:User=Depends(me), s:Session=Depends(db)):
    require_enrollment(u,"data-analytics",s)
    if x.task_id not in TASKS: raise HTTPException(404,"Unknown task")
    if len(x.query)>5000: raise HTTPException(422,"Query too long")
    g=grade(x.task_id,x.query)
    s.add(Attempt(user_id=u.id,task_id=x.task_id,query=x.query,passed=g["passed"],score=g["score"])); s.commit()
    return g

REQUIRED_TASKS = list(TASKS)  # demo policy; admin-configurable policy table is a next step
def eligibility(u, slug, s):
    unmet=[]
    t,mods=TRACKS[slug]
    for i,m in enumerate(mods):
        implemented = slug=="data-analytics" and i==1
        if not implemented: unmet.append(f"Module {i+1} '{m}': content/assessment not yet implemented")
    if slug=="data-analytics":
        for tid in REQUIRED_TASKS:
            ok=s.scalar(select(func.count()).select_from(Attempt).where(Attempt.user_id==u.id,Attempt.task_id==tid,Attempt.passed==True))
            if not ok: unmet.append(f"Pass lab task {tid}")
    unmet.append("Capstone, final mock interview and final assessment: not yet implemented")
    return unmet
@app.get("/certificates/eligibility/{slug}")
def elig(slug:str,u:User=Depends(me),s:Session=Depends(db)):
    if slug not in TRACKS: raise HTTPException(404)
    require_enrollment(u,slug,s)
    un=eligibility(u,slug,s); return {"eligible":not un,"unmet":un}
@app.post("/certificates/issue/{slug}")
def issue(slug:str,u:User=Depends(me),s:Session=Depends(db)):
    if slug not in TRACKS: raise HTTPException(404)
    require_enrollment(u,slug,s)
    un=eligibility(u,slug,s)
    if un: raise HTTPException(403,{"unmet":un})
    c=Certificate(id="DV-"+uuid.uuid4().hex[:12].upper(),user_id=u.id,track=slug); s.add(c); s.commit(); return {"certificate_id":c.id}
@app.get("/verify/{cid}")
def verify(cid:str,s:Session=Depends(db)):
    c=s.get(Certificate,cid)
    if not c: raise HTTPException(404,"Not found")
    u=s.get(User,c.user_id)
    return {"certificate_id":c.id,"name":u.name,"track":TRACKS[c.track][0],"issued":str(c.issued),
            "type":"Academy-issued course completion certificate (not an accredited degree or external certification)"}
app.mount("/", StaticFiles(directory=os.path.join(os.path.dirname(__file__),"..","static"),html=True,check_dir=False), name="ui")
