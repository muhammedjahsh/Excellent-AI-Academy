import os; os.environ["DATABASE_URL"]="sqlite:///./test.db"
from fastapi.testclient import TestClient
from app.main import app
from app.grader import grade
c=TestClient(app)
def test_grader():
    assert grade("sql-1","SELECT name FROM customers WHERE city='Kochi' ORDER BY name")["passed"]
    assert not grade("sql-1","SELECT name FROM customers")["passed"]
    assert not grade("sql-1","DROP TABLE customers")["passed"]
def test_flow():
    r=c.post("/auth/register",json={"email":"a@b.co","name":"A","password":"password1"}); h={"Authorization":"Bearer "+r.json()["token"]}
    assert c.post("/labs/sql/submit",json={"task_id":"sql-3","query":"SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*)>1"},headers=h).json()["passed"]
    assert c.post("/certificates/issue/data-analytics",headers=h).status_code==403
    assert len(c.get("/tracks").json())==4
