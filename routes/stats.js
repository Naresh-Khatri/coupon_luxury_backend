import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";
import storeModel from "../models/storeModel.js";
import categoryModel from "../models/categoryModel.js";
import offerModel from "../models/offerModel.js";

const Router = express.Router();

Router.get("/", checkIfAuthenticated, async (req, res) => {
  const storesCount = await storeModel.count();
  const categoriesCount = await categoryModel.count();
  const offersCount = await offerModel.count();

  res.json({
    storesCount,
    categoriesCount,
    offersCount,
  });
});

export default Router;
