import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import fileUpload from "express-fileupload";

import * as uploadController from "../controllers/uploads.js";

const Router = express.Router();
Router.use(fileUpload());

Router.get("/",checkIfAuthenticated, uploadController.getUploads);

Router.post("/", checkIfAuthenticated, uploadController.newUpload);

// Router.get("/:uploadId", checkIfAuthenticated, uploadController.getUpload);

Router.delete("/:uploadId", checkIfAuthenticated, uploadController.deleteUpload);



export default Router;
