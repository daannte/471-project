import mysql from "mysql2";
import dotenv from "dotenv";

// Load the env variables
dotenv.config();

// Create a connection to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "d2ldb471",
  connectionLimit: 4,
});

export default db;
