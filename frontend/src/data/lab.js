export const TASKS = [
  {
    id: "sql-1",
    title: "Kochi customers",
    prompt: "List names of customers in Kochi, ordered by name.",
    ordered: true,
    ref: "SELECT name FROM customers WHERE city = 'Kochi' ORDER BY name",
    hint: "Start from customers. Keep the Kochi rows. Return only the name column, sorted A to Z.",
  },
  {
    id: "sql-2",
    title: "Paid totals",
    prompt:
      "Total PAID amount per customer name (name, total), highest first. Exclude customers with no paid orders.",
    ordered: true,
    ref: "SELECT c.name, SUM(o.amount) FROM customers c JOIN orders o ON o.customer_id = c.id WHERE o.status = 'paid' GROUP BY c.name ORDER BY 2 DESC",
    hint: "Join orders to customers, keep status paid, sum amount per name, and sort that sum from high to low.",
  },
  {
    id: "sql-3",
    title: "Busy cities",
    prompt: "Cities with more than one customer (city, n).",
    ordered: false,
    ref: "SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) > 1",
    hint: "Group customers by city. Keep groups whose count is greater than one. Return the city and that count.",
  },
];

export const TABLES = {
  customers: [
    { id: 1, name: "Asha", city: "Kochi" },
    { id: 2, name: "Ben", city: "Delhi" },
    { id: 3, name: "Chen", city: "Kochi" },
    { id: 4, name: "Dev", city: "Pune" },
  ],
  orders: [
    { id: 1, customer_id: 1, amount: 120, status: "paid" },
    { id: 2, customer_id: 1, amount: 80, status: "paid" },
    { id: 3, customer_id: 2, amount: 50, status: "refunded" },
    { id: 4, customer_id: 3, amount: 200, status: "paid" },
    { id: 5, customer_id: 3, amount: 30, status: "paid" },
  ],
};
