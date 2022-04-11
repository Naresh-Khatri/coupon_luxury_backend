import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as slideController from "../controllers/slides.js";

const Router = express.Router();
Router.use(fileUpload());

Router.get("/", slideController.getAllSlides);
Router.get("/slideId", slideController.getSlide);

Router.delete("/:slideId",checkIfAuthenticated, slideController.deleteSlide);

Router.patch("/:slideId", checkIfAuthenticated, slideController.updateSlide);

Router.post("/", [checkIfAuthenticated], slideController.createSlide);

export default Router;
