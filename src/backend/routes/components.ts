import express from "express";
import db from "../db";
import { RowDataPacket } from "mysql2";
const router = express.Router();

router.get("/", (req, res) => {
  const type = req.query.type;

  let query = "SELECT * FROM components";
  if (type) query += ` WHERE type = '${type}'`;

  db.query(query, (err, data) => {
    if (err) return res.json(`Error fetching from table: ${err}`);
    return res.json(data);
  });
});

router.post("/", (req, res) => {
  const { name, points, weight } = req.body.component;
  const type = req.body.type;
  const f_points = parseFloat(points);
  const f_weight = parseFloat(weight);

  const query =
    "INSERT INTO components (name, weight, points, type, class) VALUES (?, ?, ?, ?, ?)";
  const values = [name, f_weight, f_points, type, "CPSC 471"];

  db.query(query, values, (err, _) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

router.put("/", (req, res) => {
  const { name, points, weight } = req.body.component;
  const f_points = parseFloat(points);
  const f_weight = parseFloat(weight);

  const in_db_query = "SELECT * FROM components WHERE name = ?";
  const update_query =
    "UPDATE components SET points = ?, weight = ? WHERE name = ?";

  db.query(in_db_query, [name], (err, result: RowDataPacket[]) => {
    if (err) return res.json({ success: false });
    else {
      if (!result.length) return res.json({ success: false });
      db.query(update_query, [f_points, f_weight, name], (update_err, _) => {
        if (update_err) {
          return res.json({ success: false });
        }
      });
      return res.json({ success: true });
    }
  });
});

router.delete("/", (req, res) => {
  const name = req.body.name;

  const query = "DELETE FROM components WHERE name = ?";

  db.query(query, [name], (err) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

export { router };
