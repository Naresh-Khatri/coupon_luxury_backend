import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as offerController from "../controllers/offers.js";

const Router = express.Router();

Router.get("/", offerController.getAllOffers);

Router.get("/:offerId", offerController.getOffer);

Router.delete("/:offerId",checkIfAuthenticated, offerController.deleteOffer);

Router.patch("/:offerId", checkIfAuthenticated, offerController.updateOffer);

Router.post("/", [checkIfAuthenticated], offerController.createOffer);

export default Router;
