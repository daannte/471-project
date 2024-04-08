import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
  const { sectionId } = req.query;

  let query = "SELECT * FROM component";
  if (sectionId) query += ` WHERE section_id = ${sectionId}`;

  db.query(query, (err, data) => {
    console.log(data);
    if (err) return res.json(`Error fetching from table: ${err}`);
    return res.json(data);
  });
});

router.post("/", (req, res) => {
  const { id, name, points, weight, sectionId, date, time } =
    req.body.component;
  const type = req.body.type;
  const f_points = parseFloat(points);
  const f_weight = parseFloat(weight);
  const datetime = new Date(`${date} ${time}:00`);

  const query =
    "INSERT INTO component (id, name, weight, points, type, section_id, date) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [id, name, f_weight, f_points, type, sectionId, datetime];

  db.query(query, values, (err, _) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

router.put("/", (req, res) => {
  const { id, name, points, weight, date, time } = req.body.component;
  const f_points = parseFloat(points);
  const f_weight = parseFloat(weight);
  const datetime = new Date(`${date} ${time}:00`);

  const query =
    "UPDATE component SET name = ?, points = ?, weight = ?, date = ? WHERE id = ?";

  db.query(query, [name, f_points, f_weight, datetime, id], (err, _) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

router.delete("/", (req, res) => {
  const id = req.body.id;
  const grade_query = "DELETE FROM grade WHERE component_id = ?";
  const query = "DELETE FROM component WHERE id = ?";

  db.query(grade_query, [id], (err) => {
    if (err) return res.json({ success: false });
    else {
      db.query(query, [id], (err) => {
        if (err) return res.json({ success: false });
        return res.json({ success: true });
      });
    }
  });
});

export { router };
