import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as bgVideoController from "../controllers/bgVideoController.js";

const Router = express.Router();
Router.use(fileUpload());

Router.get("/", bgVideoController.getVideo);
Router.patch("/", checkIfAuthenticated, bgVideoController.updateVideo);

export default Router;
