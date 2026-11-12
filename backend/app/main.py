import os, time, uuid, hashlib, hmac, jwt
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float, DateTime, func, select
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from .curriculum import TRACKS, LESSON
from .grader import TASKS, grade

SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
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

@app.get("/tracks")
def tracks(): return [{"slug":k,"title":v[0],"modules":len(v[1])} for k,v in TRACKS.items()]
@app.get("/tracks/{slug}")
def track(slug:str):
    if slug not in TRACKS: raise HTTPException(404)
    t,m=TRACKS[slug]
    return {"title":t,"modules":[{"n":i+1,"title":x,"content_status":"available" if slug=="data-analytics" and i==3 else "planned"} for i,x in enumerate(m)]}
@app.get("/lessons/sql-fundamentals")
def lesson(): return LESSON
@app.get("/labs/tasks")
def tasks(_=Depends(me)): return [{"id":k,"prompt":v["prompt"]} for k,v in TASKS.items()]
@app.post("/labs/sql/submit")
def submit(x:Sub, u:User=Depends(me), s:Session=Depends(db)):
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
        implemented = slug=="data-analytics" and i==3
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
    un=eligibility(u,slug,s); return {"eligible":not un,"unmet":un}
@app.post("/certificates/issue/{slug}")
def issue(slug:str,u:User=Depends(me),s:Session=Depends(db)):
    if slug not in TRACKS: raise HTTPException(404)
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
