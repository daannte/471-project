import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
  const ucid = req.query.ucid;

  let query;
  let queryParams: any[];

  if (ucid) {
    query =
      "SELECT section_id FROM sins WHERE student_id = ? UNION SELECT id FROM section WHERE ta_id = ? OR instr_id = ?;";
    queryParams = [ucid, ucid, ucid];
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
