import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as blogController from "../controllers/blogs.js";

const Router = express.Router();
Router.use(fileUpload());

Router.get("/", blogController.getAllBlogs);

Router.get("/:blogId", blogController.getBlog);

Router.delete("/:blogId", blogController.deleteBlog);

Router.patch("/:blogId", checkIfAuthenticated, blogController.updateBlog);

Router.post("/", [checkIfAuthenticated], blogController.createBlog);

export default Router;
