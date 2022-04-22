import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as subCategoryController from "../controllers/subCategories.js";

const Router = express.Router();
Router.use(fileUpload());

Router.get("/", subCategoryController.getPublicSubCategories);

Router.get("/all", checkIfAuthenticated, subCategoryController.getAllSubCategories);


Router.get("/:subCategoryId", subCategoryController.getSubCategory);

Router.delete("/:subCategoryId",checkIfAuthenticated, subCategoryController.deleteSubCategory);

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
