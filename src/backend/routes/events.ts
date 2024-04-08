import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
  const ucid = req.query.ucid;

  const query = "SELECT * FROM addedEvent WHERE student_id = ?";

  db.query(query, [ucid], (err, data) => {
    if (err) return res.json(`Error fetching from table: ${err}`);
    return res.json(data);
  });
});

router.post("/", (req, res) => {
  const { id, date, time, title } = req.body;
  const ucid = req.query.ucid;
  const datetime = new Date(`${date} ${time}:00`);

  const query =
    "INSERT INTO addedEvent (id, student_id, date, name) VALUES (?, ?, ?, ?)";
  const values = [id, ucid, datetime, title];

  db.query(query, values, (err, _) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

router.put("/", (req, res) => {
  const { id, date, time, title } = req.body;
  const datetime = new Date(`${date} ${time}:00`);

  const query = "UPDATE addedEvent SET name = ?, date = ? WHERE id = ?";
  const values = [title, datetime, id];

  db.query(query, values, (err, _) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM addedEvent WHERE id = ?";

  db.query(query, [id], (err, _) => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

export { router };
