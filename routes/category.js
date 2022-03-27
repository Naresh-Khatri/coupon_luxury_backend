import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as categoryController from "../controllers/categories.js";



const Router = express.Router();
Router.use(fileUpload());

Router.get("/", categoryController.getAllCategories);

Router.get("/:catagory", categoryController.getCategory);

Router.patch(
  "/:catagory",
  checkIfAuthenticated,
  categoryController.updateCategory
);
Router.post("/", [checkIfAuthenticated], categoryController.createCategory);

export default Router;
