import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as blogController from "../controllers/blogs.js";

const Router = express.Router();
Router.use(fileUpload());

Router.get("/", blogController.getPublicBlogs);

Router.get("/all", checkIfAuthenticated, blogController.getAllBlogs);

Router.get("/:blogId", blogController.getBlog);

Router.get("/getUsingSlug/:blogSlug", blogController.getBlogWithSlug);

Router.delete("/:blogId", checkIfAuthenticated, blogController.deleteBlog);

Router.patch("/:blogId", checkIfAuthenticated, blogController.updateBlog);

Router.post("/", [checkIfAuthenticated], blogController.createBlog);

Router.post('/v2', blogController.createBlogV2);

export default Router;
