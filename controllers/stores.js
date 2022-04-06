import streamifier from "streamifier";
import storeModel from "../models/storeModel.js";
import categoryModel from "../models/categoryModel.js";
import subCategoryModel from "../models/subCategoryModel.js";

import cloudinary from "../config/cloudinaryConfig.js";

export async function createStore(req, res) {
  try {
    // console.log(req.body);
    // console.log(req.files);
    // return res.status(200).json({
    //   message: "Category created successfully",
    // });
    //check if title already exists
    const storeExists = await storeModel.findOne({
      storeName: req.body.storeName,
    });
    if (storeExists) {
      return res.status(409).send("store already exists");
    } else {
      //create new category

      //upload buffer to cloudinary
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.files.image.data).pipe(stream);
        });
      };

      let result = await streamUpload(req);
      console.log(result);
      //TODO: are category and subCategory required?
      const newStore = await storeModel({
        ...req.body,
        uid: req.user.uid,
        image: result.secure_url,
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
      //upload buffer to cloudinary
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.files.image.data).pipe(stream);
        });
      };
      let result = await streamUpload(req);
      const updatedStore = await storeModel.findByIdAndUpdate(
        req.params.storeId,
        { ...req.body, image: result.secure_url },
        { new: true }
      );
      res.json(updatedStore);
    } else {
      const updatedStore = await storeModel.findByIdAndUpdate(
        req.params.storeId,
        req.body,
        { new: true }
      );
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
    const allStores = await storeModel.find({}).sort({ title: -1 });
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
