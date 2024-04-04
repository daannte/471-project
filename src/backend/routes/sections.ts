import express from "express";
import db from "../db";
const router = express.Router();

router.get("/", (_, res) => {
  const query = "SELECT * FROM section;";
  db.query(query, (err, data) => {
    if (err) return res.json(`Error fetching from table: ${err}`);
    return res.json(data);
  });
});

export { router };
