import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
  const { sectionId } = req.query;

  let query = "SELECT * FROM grade_scale WHERE section_id = ?";

  db.query(query, [sectionId], (err, data) => {
    if (err) return res.json(`Error fetching from table: ${err}`);
    return res.json(data);
  });
});

export { router };
