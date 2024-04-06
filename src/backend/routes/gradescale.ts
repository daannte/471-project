import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
    const { sectionId } = req.query;
  
    let query = "SELECT * FROM grade_scale";
    if (sectionId) query += ` WHERE section_id = ${sectionId}`;
  
    db.query(query, (err, data) => {
      if (err) return res.json(`Error fetching from table: ${err}`);
      return res.json(data);
    });
  });

export { router };
