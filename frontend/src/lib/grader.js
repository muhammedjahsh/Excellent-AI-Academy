import alasql from "alasql";
import { TABLES, TASKS } from "../data/lab";

const SCHEMA = [
  "CREATE TABLE customers (id INT, name STRING, city STRING)",
  "CREATE TABLE orders (id INT, customer_id INT, amount NUMBER, status STRING)",
  ...TABLES.customers.map(
    (row) => `INSERT INTO customers VALUES (${row.id}, '${row.name}', '${row.city}')`,
  ),
  ...TABLES.orders.map(
    (row) =>
      `INSERT INTO orders VALUES (${row.id}, ${row.customer_id}, ${row.amount}, '${row.status}')`,
  ),
];

function database() {
  const db = new alasql.Database();
  SCHEMA.forEach((statement) => db.exec(statement));
  return db;
}

export function prepareQuery(query) {
  const sql = query.trim().replace(/;+\s*$/, "");
  if (!sql) throw new Error("Write a SELECT query first.");
  if (sql.includes(";")) throw new Error("Submit a single statement.");
  if (!/^select\b/i.test(sql)) throw new Error("This lab accepts SELECT queries.");
  if (/\b(insert|update|delete|drop|alter|attach|pragma|into|create)\b/i.test(sql)) {
    throw new Error("Only a read-only SELECT is allowed here.");
  }
  return sql;
}

function cells(rows) {
  return rows.map((row) => {
    const values = Array.isArray(row) ? row : Object.values(row);
    return values.map((value) => (typeof value === "number" ? Math.round(value * 1e6) / 1e6 : value));
  });
}

export function runQuery(query) {
  try {
    const sql = prepareQuery(query);
    const rows = database().exec(sql);
    return { ok: true, columns: rows[0] ? Object.keys(rows[0]) : [], rows: cells(rows) };
  } catch (error) {
    return { ok: false, error: error.message || "The query could not run." };
  }
}

export function gradeQuery(taskId, query) {
  const task = TASKS.find((item) => item.id === taskId);
  if (!task) return { passed: false, score: 0, feedback: "Unknown task." };

  const got = runQuery(query);
  if (!got.ok) return { passed: false, score: 0, feedback: got.error };

  const expected = runQuery(task.ref);
  let actual = got.rows;
  let reference = expected.rows;
  if (!task.ordered) {
    const key = (row) => JSON.stringify(row);
    actual = [...actual].sort((a, b) => key(a).localeCompare(key(b)));
    reference = [...reference].sort((a, b) => key(a).localeCompare(key(b)));
  }

  if (JSON.stringify(actual) === JSON.stringify(reference)) {
    return { passed: true, score: 100, feedback: "Correct." };
  }

  const hint =
    actual.length && reference.length && actual[0].length !== reference[0].length
      ? "Column count differs."
      : actual.length !== reference.length
        ? `Expected ${reference.length} rows, got ${actual.length}.`
        : "Row values or order differ.";

  return {
    passed: false,
    score: 0,
    feedback: `${hint} Re-check your filter, join, or grouping.`,
  };
}
