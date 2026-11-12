"""Deterministic SQL grading. Learner SQL runs in a separate process, SELECT-only, with a timeout.
NOTE: for production use a container/gVisor sandbox (see README)."""
import json, subprocess, sys
SCHEMA = """CREATE TABLE customers(id INT, name TEXT, city TEXT);
CREATE TABLE orders(id INT, customer_id INT, amount REAL, status TEXT);
INSERT INTO customers VALUES (1,'Asha','Kochi'),(2,'Ben','Delhi'),(3,'Chen','Kochi'),(4,'Dev','Pune');
INSERT INTO orders VALUES (1,1,120,'paid'),(2,1,80,'paid'),(3,2,50,'refunded'),(4,3,200,'paid'),(5,3,30,'paid');"""
# Reference solutions and prompts live server-side only (hidden tests).
TASKS = {
 "sql-1": {"prompt":"List names of customers in Kochi, ordered by name.","ref":"SELECT name FROM customers WHERE city='Kochi' ORDER BY name","ordered":True},
 "sql-2": {"prompt":"Total PAID amount per customer name (name, total), highest first. Exclude customers with no paid orders.","ref":"SELECT c.name, SUM(o.amount) FROM customers c JOIN orders o ON o.customer_id=c.id WHERE o.status='paid' GROUP BY c.name ORDER BY 2 DESC","ordered":True},
 "sql-3": {"prompt":"Cities with more than one customer (city, n).","ref":"SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*)>1","ordered":False},
}
RUNNER = r'''
import sqlite3, sys, json
schema, q = json.loads(sys.stdin.read())
c = sqlite3.connect(":memory:"); c.executescript(schema)
def auth(a, *_):
    return sqlite3.SQLITE_OK if a in (sqlite3.SQLITE_SELECT, sqlite3.SQLITE_READ, sqlite3.SQLITE_FUNCTION) else sqlite3.SQLITE_DENY
c.set_authorizer(auth)
try:
    print(json.dumps({"ok":True,"rows":[list(r) for r in c.execute(q).fetchmany(1000)]}))
except Exception as e:
    print(json.dumps({"ok":False,"error":str(e)}))
'''
def _run(q):
    try:
        p = subprocess.run([sys.executable,"-I","-c",RUNNER], input=json.dumps([SCHEMA,q]), capture_output=True, text=True, timeout=5)
        return json.loads(p.stdout)
    except Exception as e:
        return {"ok":False,"error":f"execution failed: {type(e).__name__}"}
def _norm(rows): return [[round(x,6) if isinstance(x,float) else x for x in r] for r in rows]
def grade(task_id, query):
    t = TASKS[task_id]; exp = _run(t["ref"]); got = _run(query)
    if not got["ok"]: return {"passed":False,"score":0,"feedback":"Error: "+got["error"]}
    a, b = _norm(got["rows"]), _norm(exp["rows"])
    if not t["ordered"]: a, b = sorted(a,key=str), sorted(b,key=str)
    if a == b: return {"passed":True,"score":100,"feedback":"Correct."}
    hint = "Column count differs." if a and b and len(a[0])!=len(b[0]) else f"Expected {len(b)} rows, got {len(a)}." if len(a)!=len(b) else "Row values or order differ."
    return {"passed":False,"score":0,"feedback":hint+" Re-check your filter, join or grouping."}
