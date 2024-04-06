import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
  const ucid = req.query.ucid;
  const { cname, cnum } = req.query;

  let query;
  let queryParams: any[];

  if (ucid) {
    query = `
    SELECT DISTINCT c.name, c.number, c.title
    FROM course AS c
    JOIN (
        SELECT course_name AS name, course_num AS number
        FROM section
        JOIN (
            SELECT section_id AS id
            FROM sins
            WHERE student_id = ?
            UNION
            SELECT id
            FROM section
            WHERE ta_id = ? OR instr_id = ?
        ) AS sections ON section.id = sections.id
    ) AS joined_sections ON c.name = joined_sections.name AND c.number = joined_sections.number;
    `;
    queryParams = [ucid, ucid, ucid];
  } else if (cname && cnum) {
    query = "SELECT id FROM section WHERE course_name = ? AND course_num = ?";
    queryParams = [cname, cnum];
  } else {
    query = "SELECT * FROM section;";
    queryParams = [];
  }

  db.query(query, queryParams, (err, data) => {
    if (err) return res.json(`Error fetching from table: ${err}`);
    return res.json(data);
  });
});

export { router };
