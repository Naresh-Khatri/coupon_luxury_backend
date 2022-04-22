import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
const Router = express.Router();

Router.get("/", (req, res) => {
  res.json("<h1>Hello World</h1>");
});

Router.post("/register", (req, res) => {
  res.json({
    message: "Registering user...",
  });
});
Router.post("/verifyToken", checkIfAuthenticated, (req, res) => {
  console.log(req.user)
  res.json({verified: !!req.user});
});

export default Router;
