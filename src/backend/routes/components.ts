import express from "express";
import db from "../db";
import { RowDataPacket } from "mysql2";
const router = express.Router();

router.get("/", (req, res) => {
  const { type, sectionId } = req.query;

  let query = "SELECT * FROM component";
  if (type) query += ` WHERE type = '${type}'`;
  if (sectionId) query += ` AND section_id = ${sectionId}`;

  db.query(query, (err, data) => {
    if (err) return res.json(`Error fetching from table: ${err}`);
    return res.json(data);
  });
});

router.post("/", (req, res) => {
  const { id, name, points, weight, sectionId, date } = req.body.component;
  const type = req.body.type;
  const f_points = parseFloat(points);
  const f_weight = parseFloat(weight);

  const query =
    "INSERT INTO component (id, name, weight, points, type, section_id, date) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [id, name, f_weight, f_points, type, sectionId, date];

  db.query(query, values, (err, _) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

router.put("/", (req, res) => {
  const { id, name, points, weight } = req.body.component;
  const f_points = parseFloat(points);
  const f_weight = parseFloat(weight);

  const in_db_query = "SELECT * FROM component WHERE id = ?";
  const update_query =
    "UPDATE component SET name = ?, points = ?, weight = ? WHERE id = ?";

  db.query(in_db_query, [id], (err, result: RowDataPacket[]) => {
    if (err) return res.json({ success: false });
    else {
      if (result.length === 0) return res.json({ success: false });
      db.query(
        update_query,
        [name, f_points, f_weight, id],
        (update_err, _) => {
          if (update_err) {
            return res.json({ success: false });
          }
        },
      );
      return res.json({ success: true });
    }
  });
});

router.delete("/", (req, res) => {
  const id = req.body.id;

  const query = "DELETE FROM component WHERE id = ?";

  db.query(query, [id], (err) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

export { router };
