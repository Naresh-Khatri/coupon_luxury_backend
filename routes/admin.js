import express from "express";
const Router = express.Router();


Router.get("/", (req, res) => {
  res.json("<h1>Hello World</h1>");
});

Router.post("/register", (req, res) => {
  res.json({
    message: "Registering user...",
  });
});


export default Router;
