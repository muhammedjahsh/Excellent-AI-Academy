import os; os.environ["DATABASE_URL"]="sqlite:///./test.db"
from types import SimpleNamespace
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import select
from app import main as academy
from app.grader import grade
c=TestClient(academy.app)
def test_grader():
    assert grade("sql-1","SELECT name FROM customers WHERE city='Kochi' ORDER BY name")["passed"]
    assert not grade("sql-1","SELECT name FROM customers")["passed"]
    assert not grade("sql-1","DROP TABLE customers")["passed"]
def test_registration_persists_normalized_account_with_hashed_password():
    email=f"{uuid.uuid4().hex}@example.test"
    password="password1"
    response=c.post("/auth/register",json={"email":f" {email.upper()} ","name":"  Learner  ","password":password})
    assert response.status_code==200
    with academy.SessionLocal() as session:
        user=session.scalar(select(academy.User).where(academy.User.email==email))
        assert user is not None
        assert user.name=="Learner"
        assert user.password_hash!=password
        assert academy.check_pw(password,user.password_hash)
    assert c.post("/auth/register",json={"email":email,"name":"Learner","password":password}).status_code==409
    assert c.post("/auth/login",json={"email":email.upper(),"password":password}).status_code==200

def test_flow():
    email=f"{uuid.uuid4().hex}@example.test"
    r=c.post("/auth/register",json={"email":email,"name":"A","password":"password1"}); h={"Authorization":"Bearer "+r.json()["token"]}
    session=academy.SessionLocal()
    user=session.scalar(select(academy.User).where(academy.User.email==email))
    if not session.scalar(select(academy.Enrollment.id).where(academy.Enrollment.user_id==user.id,academy.Enrollment.track=="data-analytics")):
        session.add(academy.Enrollment(user_id=user.id,track="data-analytics",order_id="test-fixture"))
    session.commit()
    session.close()
    assert c.post("/labs/sql/submit",json={"task_id":"sql-3","query":"SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*)>1"},headers=h).json()["passed"]
    assert c.post("/certificates/issue/data-analytics",headers=h).status_code==403
    assert len(c.get("/tracks").json())==10
    data_analytics = c.get("/tracks/data-analytics").json()["modules"]
    assert len(data_analytics) == 7
    assert data_analytics[1]["title"] == "Query and databases"
    assert data_analytics[1]["content_status"] == "available"
    assert len(c.get("/tracks/data-science").json()["modules"]) == 19
    assert len(c.get("/tracks/cybersecurity").json()["modules"]) == 13

def test_paid_course_checkout(monkeypatch):
    email=f"{uuid.uuid4().hex}@example.test"
    registered=c.post("/auth/register",json={"email":email,"name":"Learner","password":"password1"})
    assert registered.status_code==200
    headers={"Authorization":"Bearer "+registered.json()["token"]}
    assert c.get("/billing/enrollments",headers=headers).json()=={"courses":[]}
    assert c.get("/labs/tasks",headers=headers).status_code==403
    catalog=c.get("/billing/catalog").json()
    assert catalog["currency"]=="INR"
    assert len(catalog["courses"])==10
    assert {course["amount_paise"] for course in catalog["courses"]}=={1_000_000}
    assert c.post("/billing/checkout",json={"courses":["not-a-course"]},headers=headers).status_code==422

    monkeypatch.setattr(academy,"STRIPE_SECRET_KEY","sk_test_for_unit_test")
    created={}
    def create_session(**kwargs):
        created.update(kwargs)
        amount=sum(item["price_data"]["unit_amount"]*item["quantity"] for item in kwargs["line_items"])
        session=SimpleNamespace(
            id="cs_test_"+uuid.uuid4().hex,
            url="https://checkout.stripe.test/session",
            metadata=kwargs["metadata"],
            client_reference_id=kwargs["client_reference_id"],
            currency="inr",
            amount_total=amount,
            payment_status="paid",
        )
        created["session"]=session
        return session
    monkeypatch.setattr(academy.stripe.checkout.Session,"create",staticmethod(create_session))
    monkeypatch.setattr(academy.stripe.checkout.Session,"retrieve",staticmethod(lambda _session_id: created["session"]))
    checkout=c.post("/billing/checkout",json={"courses":["data-analytics","data-science"]},headers=headers)
    assert checkout.status_code==200
    assert len(created["line_items"])==2
    assert created["line_items"][0]["price_data"]["unit_amount"]==1_000_000
    created["session"].amount_total+=100
    assert c.get("/billing/checkout/"+created["session"].id,headers=headers).status_code==400
    created["session"].amount_total-=100
    status=c.get("/billing/checkout/"+created["session"].id,headers=headers)
    assert status.status_code==200
    assert status.json()["status"]=="paid"
    assert status.json()["courses"]==["data-analytics","data-science"]
    assert set(c.get("/billing/enrollments",headers=headers).json()["courses"])=={"data-analytics","data-science"}
    assert c.get("/labs/tasks",headers=headers).status_code==200
    assert c.post("/billing/checkout",json={"courses":["data-analytics"]},headers=headers).status_code==409

def test_webhook_rejects_unconfigured_or_unsigned_requests(monkeypatch):
    monkeypatch.setattr(academy,"STRIPE_WEBHOOK_SECRET",None)
    assert c.post("/billing/webhook",content="{}").status_code==503
    monkeypatch.setattr(academy,"STRIPE_WEBHOOK_SECRET","whsec_test_secret")
    response=c.post("/billing/webhook",content="{}",headers={"stripe-signature":"invalid"})
    assert response.status_code==400
