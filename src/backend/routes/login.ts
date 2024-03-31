import axios from "axios";
import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await axios.get("http://localhost:5173/api/users");
    const users = response.data;
    console.log(users);
    const user = users.find(
      (user: any) => user.email === email && user.password === password,
    );

    if (user) {
      const token = "testtoken123";
      res.json({ token });
    }
  } catch (err) {
    console.log("Error: " + err);
  }
});

export { router };
