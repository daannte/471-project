import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
    const ucid = req.query.ucid;
  
    let query;
    let queryParams: any[];
  
    if (ucid) {
        query = `
        SELECT course_name, course_num, name, date
        FROM component
        JOIN (
            SELECT section_id AS id, course_name, course_num
            FROM sins
            WHERE student_id = ?
            UNION
            SELECT id, course_name, course_num
            FROM section
            WHERE ta_id = ? OR instr_id = ?
        ) AS sections ON component.id = sections.id;
        `;
      queryParams = [ucid, ucid, ucid];
    } else {
      query = "SELECT * FROM component;";
      queryParams = [];
    }
  
    db.query(query, queryParams, (err, data) => {
      if (err) return res.json(`Error fetching from table: ${err}`);
      return res.json(data);
    });
  });
  
  export { router };
  