import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";

import * as subscriptionController from "../controllers/subscriptions.js";

const Router = express.Router();

Router.get("/", checkIfAuthenticated, subscriptionController.getAllSubs);

Router.get("/:subId", checkIfAuthenticated, subscriptionController.getSub);

Router.delete(
  "/:subId",
  checkIfAuthenticated,
  subscriptionController.deleteSub
);

Router.patch("/:subId", checkIfAuthenticated, subscriptionController.updateSub);

Router.post("/", subscriptionController.createSub);

export default Router;
