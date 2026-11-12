import alasql from "alasql";

const schema = [
  "CREATE TABLE customers (id INT, name STRING, city STRING)",
  "CREATE TABLE orders (id INT, customer_id INT, amount NUMBER, status STRING)",
  "INSERT INTO customers VALUES (1,'Asha','Kochi'),(2,'Ben','Delhi'),(3,'Chen','Kochi'),(4,'Dev','Pune')",
  "INSERT INTO orders VALUES (1,1,120,'paid'),(2,1,80,'paid'),(3,2,50,'refunded'),(4,3,200,'paid'),(5,3,30,'paid')",
];

function run(sql) {
  const db = new alasql.Database();
  schema.forEach((statement) => db.exec(statement));
  return db.exec(sql);
}

const queries = [
  "SELECT name FROM customers WHERE city = 'Kochi' ORDER BY name",
  "SELECT c.name, SUM(o.amount) FROM customers c JOIN orders o ON o.customer_id = c.id WHERE o.status = 'paid' GROUP BY c.name ORDER BY 2 DESC",
  "SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) > 1",
];

for (const sql of queries) {
  console.log(sql);
  console.log(JSON.stringify(run(sql)));
}
