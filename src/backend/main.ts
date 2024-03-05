import express, { Express } from "express";
import cors from "cors";

import { homedemo } from "./routes";

// Setup express
const app: Express = express();
app.use(cors());
app.use(express.json());

// Use the routes
app.use("/homedemo", homedemo);

// For endpoints that don't exist
app.use("*", (_, res) => {
  res.status(404).json("Endpoint not found");
});

// Listen for server
const port = 8080;
app.listen(port, () => {
  console.log(`[Server]: Listening on port ${port}!`);
});