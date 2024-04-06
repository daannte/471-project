import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
  const section_id = req.query.section_id;
  let query;
  let queryParams: any[];

  if (section_id) {
    query = "SELECT student_id FROM sins WHERE section_id=?;";
    queryParams = [section_id];
  } else {
    query = "SELECT * FROM grade;";
    queryParams = [];
  }
  db.query(query, queryParams, (err, data) => {
    if (err) return res.json(`Error fetching from table: ${err}`);
    return res.json(data);
  });
});

export { router };
