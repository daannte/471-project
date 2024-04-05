import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
  const { cname, cnum, ucid } = req.query;

  let query;
  let queryParams: any[];

  if (cname && cnum && ucid) {
    query = "SELECT * FROM section WHERE course_name=? AND course_num=? AND (ta_id=? OR instr_id=?);";
    queryParams = [cname, cnum, ucid, ucid];
  } else {
    query = "SELECT * FROM user;";
    queryParams = [];
  }

  db.query(query, queryParams, (err, data) => {
    if (err) return res.json(`Error fetching from table: ${err}`);
    return res.json(data);
  });
});

export { router };
