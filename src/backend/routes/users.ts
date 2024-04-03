import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (req, res) => {
  const name = req.query.name;

  let query;
  let queryParams: any[];

  if (name) {
    query = "SELECT role_type FROM user WHERE full_name = ?;";
    queryParams = [name];
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
