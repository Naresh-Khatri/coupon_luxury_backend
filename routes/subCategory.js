import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as subCategoryController from "../controllers/subCategories.js";

const Router = express.Router();
Router.use(fileUpload());

Router.get("/", subCategoryController.getAllSubCategories);

Router.get("/:subCategoryId", subCategoryController.getSubCategory);

Router.delete("/:subCategoryId", subCategoryController.deleteSubCategory);

Router.patch(
  "/:subCategoryId",
  checkIfAuthenticated,
  subCategoryController.updateSubCategory
);
Router.post(
  "/",
  [checkIfAuthenticated],
  subCategoryController.createSubCategory
);

export default Router;
