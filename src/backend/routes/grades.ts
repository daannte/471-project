import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
  const { sectionId } = req.query;
  let query;
  let queryParams: any[];

  if (sectionId) {
    query = "SELECT student_id FROM sins WHERE section_id=?;";
    queryParams = [sectionId];
  } else {
    query = "SELECT * FROM grade;";
    queryParams = [];
  }
  db.query(query, queryParams, (err, data) => {
    if (err) return res.json(`Error fetching from table: ${err}`);
    return res.json(data);
  });
});

router.post("/", (req, res) => {
  const { ucid, id, grade } = req.body;
  const f_grade = parseFloat(grade);

  if (ucid !== undefined && id !== undefined && grade !== undefined) {
    const query =
      "INSERT INTO grade (ucid, component_id, points) VALUES (?, ?, ?)";
    const values = [ucid, id, f_grade];

    db.query(query, values, (err, _) => {
      if (err) return res.json({ success: false });
      return res.json({ success: true });
    });
  } else return res.json("fail");
});

export { router };
