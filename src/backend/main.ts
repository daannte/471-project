import express, { Express } from "express";
import cors from "cors";

import { users, login, grades, components } from "./routes";

// Setup express
const app: Express = express();
app.use(cors());
app.use(express.json());

// Use the routes
app.use("/api/users", users);
app.use("/api/login", login);
app.use("/api/grades", grades);
app.use("/api/components", components);

// For endpoints that don't exist
app.use("/api/*", (_, res) => {
  res.status(404).json("Endpoint doesn't exist!");
});

// Listen for server
const port = 8080;
app.listen(port, () => {
  console.log(`[Server]: Listening on port ${port}!`);
});
