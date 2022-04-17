import streamifier from "streamifier";
import storeModel from "../models/storeModel.js";
import categoryModel from "../models/categoryModel.js";
import subCategoryModel from "../models/subCategoryModel.js";

import cloudinary from "../config/cloudinaryConfig.js";
import imageKit from "../config/imagekitConfig.js";
import { removeImgFromImageKit } from "../config/imagekitConfig.js";

export async function createStore(req, res) {
  try {
    console.log(req.body);
    // console.log(req.files);

    // return res.status(200).json({
    //   message: "Category created successfully",
    //   data: res,
    // });
    //check if title already exists
    const storeExists = await storeModel.findOne({
      storeName: req.body.storeName,
    });
    if (storeExists) {
      return res.status(409).send("store already exists");
    } else {
      //create new category

      //upload buffer to imageKit
      const result = await imageKit.upload({
        file: req.files.image.data,
        fileName: req.body.slug,
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      });
      console.log(result);
      //TODO: are category and subCategory required?
      const newStore = await storeModel({
        ...req.body,
        uid: req.user.uid,
        image: result.url,
      });
      newStore.save((err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).send("Invalid Request");
        }
        res.json(result);
      });
      // res.json("noice");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid Request");
  }
}

export async function updateStore(req, res) {
  try {
    // console.log(req.params.storeId, req.body, req.files);
    // console.log('\n\n\n\n\n\n Heli')
    //check if image is provided
    if (req.files && req.files.image) {
      //upload buffer to imageKit
      const result = await imageKit.upload({
        file: req.files.image.data,
        fileName: req.body.slug,
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      });
      const updatedStore = await storeModel.findByIdAndUpdate(
        req.params.storeId,
        { ...req.body, image: result.url },
        { new: false }
      );
      //now remove the old image from imageKit
      //grab the old image from the db
      const oldImageName =
        updatedStore.image.split("/")[updatedStore.image.split("/").length - 1];
      //remove the old image from imageKit
      await removeImgFromImageKit(oldImageName);
      res.json(updatedStore);
    } else {
      const updatedStore = await storeModel.findByIdAndUpdate(
        req.params.storeId,
        req.body,
        { new: true }
      );
      // console.log(req.body.category);
      // console.log(updatedStore.category);
      // console.log("updated record", updatedStore);
      res.json(updatedStore);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getStore(req, res) {
  try {
    //do a case insensitive search
    const store = await storeModel
      .findById(req.params.storeId)
      .populate("category", "categoryName categorySlug _id ")
      .populate("subCategory", "subCategoryName subCategorySlug _id ")
      .sort({ storeName: -1 });
    res.send(store);
  } catch (err) {
    console.log(err);
  }
}
export async function getStoreWithName(req, res) {
  try {
    //do a case insensitive search
    const store = await storeModel
      .findOne({
        storeName: { $regex: `^${req.params.storeName}$`, $options: "i" },
      })
      .populate("category", "categoryName categorySlug _id ")
      .populate("subCategory", "subCategoryName subCategorySlug _id ")
      .populate("offers");
    res.send(store);
  } catch (err) {
    console.log(err);
  }
}
export async function getStoreWithSlug(req, res) {
  try {
    // console.log(req.params.storeSlug);
    // do a case insensitive search
    const store = await storeModel
      .findOne({
        slug: { $regex: `^${req.params.storeSlug}$`, $options: "i" },
      })
      .populate("category", "categoryName categorySlug _id ")
      .populate("subCategory", "subCategoryName subCategorySlug _id ")
      .populate("offers");
    res.send(store);
  } catch (err) {
    console.log(err);
  }
}
export async function getAutoCompleteData(req, res) {
  try {
    const { searchText } = req.body;
    const regex = new RegExp(`^${searchText}`);
    console.log(req.body);
    //do a case insensitive search
    const store = await storeModel
      .find({
        storeName: { $regex: regex, $options: "is" },
      })
      .select("storeName slug -_id");
    console.log(store);
    res.send(store);
  } catch (err) {
    console.log(err);
  }
}
export async function getAllStores(req, res) {
  try {
    const allStores = await storeModel
      .find({})
      .populate("category", "categoryName categorySlug _id ")
      .populate("subCategory", "subCategoryName subCategorySlug _id ")
      .sort({ title: -1 });
    res.send(allStores);
  } catch (err) {
    console.log(err);
  }
}
export async function getPublicStores(req, res) {
  let allStores = null;
  try {
    if (req.query.featured === "true") {
      allStores = await storeModel
        .find({ featured: true, active: true })
        .populate("category", "categoryName categorySlug _id ")
        .populate("subCategory", "subCategoryName subCategorySlug _id ")
        .sort({ title: -1 });
    } else {
      allStores = await storeModel
        .find({ active: true })
        .populate("category", "categoryName categorySlug _id ")
        .populate("subCategory", "subCategoryName subCategorySlug _id ")
        .sort({ title: -1 });
    }
    res.send(allStores);
  } catch (err) {
    console.log(err);
  }
}
export async function deleteStore(req, res) {
  try {
    console.log(req.body);
    const deletedStore = await storeModel.findByIdAndRemove(req.params.storeId);
    res.json(deletedStore);
  } catch (err) {
    console.log(err);
  }
}
