const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("Database Connected");
  }
});

app.post("/add-work", (req, res) => {
  const { name, service, amount, payment, phone, address } = req.body;

  const sql = `
    INSERT INTO daily_work
    (work_date, work_day, entry_time, customer_name, service_given, amount, payment_mode, phone, address)
    VALUES (CURDATE(), DAYNAME(CURDATE()), CURTIME(), ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, service, amount, payment, phone, address], err => {
    if (err) return res.status(500).send("Error saving data");
    res.send("Saved Successfully");
  });
});

app.get("/today", (req, res) => {
  db.query(
    "SELECT * FROM daily_work WHERE work_date = CURDATE()",
    (err, result) => {
      if (err) return res.send("Error");
      res.json(result);
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

