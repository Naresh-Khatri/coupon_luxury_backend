import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as storeController from "../controllers/stores.js";

const Router = express.Router();
Router.use(fileUpload());

Router.get("/", storeController.getPublicStores);

Router.get("/all",checkIfAuthenticated, storeController.getAllStores);

Router.get("/:storeId", storeController.getStore);

Router.get("/getUsingName/:storeName", storeController.getStoresWithName);

Router.get("/getUsingSlug/:storeSlug", storeController.getStoreWithSlug);

Router.post("/getAutoCompleteData/", storeController.getAutoCompleteData);

Router.delete("/:storeId",checkIfAuthenticated, storeController.deleteStore);

Router.patch("/:storeId", checkIfAuthenticated, storeController.updateStore);

Router.post("/", [checkIfAuthenticated], storeController.createStore);

export default Router;
