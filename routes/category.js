import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as categoryController from "../controllers/categories.js";

const Router = express.Router();
Router.use(fileUpload());

Router.get("/", categoryController.getAllCategories);

Router.get("/:categoryId", categoryController.getCategory);


Router.get("/getUsingName/:categoryName", categoryController.getCategoryWithName);

Router.get("/getUsingSlug/:categorySlug", categoryController.getCategoryWithSlug);
Router.get(
  "/getAllSubCategories/:categoryId",
  categoryController.getSubCategories
);
Router.post("/getAutoCompleteData/", categoryController.getAutoCompleteData);

Router.delete("/:categoryId", categoryController.deleteCategory);

Router.patch(
  "/:categoryId",
  checkIfAuthenticated,
  categoryController.updateCategory
);
Router.post("/", [checkIfAuthenticated], categoryController.createCategory);

export default Router;
