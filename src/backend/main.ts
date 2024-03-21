import express, { Express } from "express";
import cors from "cors";

import { fetchUser, test } from "./routes";

// Setup express
const app: Express = express();
app.use(cors());
app.use(express.json());

// Use the routes
app.use("/api/fetchUser", fetchUser);
app.use("/api/test", test);

// For endpoints that don't exist
app.use("/api/*", (_, res) => {
  res.status(404).json("Endpoint doesn't exist!");
});

// Listen for server
const port = 8080;
app.listen(port, () => {
  console.log(`[Server]: Listening on port ${port}!`);
});
