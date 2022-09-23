import express from "express";

import storeModel from "../models/storeModel.js";
import categoryModel from "../models/categoryModel.js";
import slideModel from "../models/slideModel.js";
import offerModel from "../models/offerModel.js";

const Router = express.Router();

Router.get("/", async (req, res) => {
  const promises = [
    storeModel
      .find({ active: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("storeName slug image _id")
      .populate("category", "categoryName categorySlug _id ")
      .populate("subCategory", "subCategoryName subCategorySlug _id ")
      .sort({ title: -1 }),
    categoryModel
      .find({ active: true })
      .select(
        "-subCategories -description -createdAt -updatedAt -__v -active -metaTitle -metaDescription -metaKeywords"
      )
      .sort({ categoryName: 1 }),
    slideModel
      .find({ active: true })
      .sort({ order: -1 })
      .select("-uid -__v -createdAt -updatedAt -_id -active"),
    offerModel
      .find({ active: true, featured: true })
      .limit(10)
      .select(
        "offerName slug image _id category title URL affURL couponCode discountType discountValue"
      )
      .populate("store", "storeName slug image _id")
      .sort({ updatedAt: -1 }),
  ];
  const [featuredStores, categories, slides, featuredOffers] =
    await Promise.all(promises);
  res.send({ featuredStores, categories, slides, featuredOffers });
});

export default Router;
