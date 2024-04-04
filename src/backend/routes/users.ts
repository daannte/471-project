import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
  const ucid = req.query.ucid;

  let query;
  let queryParams: any[];

  if (ucid) {
    query = "SELECT role_type FROM user WHERE ucid = ?;";
    queryParams = [ucid];
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
