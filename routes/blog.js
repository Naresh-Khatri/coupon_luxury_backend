import express from "express";
import BlogModel from "../models/BlogModel.js";

const Router = express.Router();

Router.get("/", async (req, res) => {
  try {
    const allBlogs = await BlogModel.find({}).sort({ createdAt: -1 });
    console.log('allBlogs', allBlogs);
    res.send(allBlogs);
  } catch (err) {
    console.log(err);
  }
});
Router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newBlog = await BlogModel({ title, content });
    newBlog.save();
    res.json(newBlog);
  } catch (err) {
    console.log(err);
  }
});

export default Router;