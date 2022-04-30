import express from "express";

import * as miscController from "../controllers/misc.js";

const Router = express.Router();

Router.get("/sitemap", miscController.getSitemap);

export default Router;
