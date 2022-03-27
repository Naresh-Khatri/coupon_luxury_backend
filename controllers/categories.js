import streamifier from "streamifier";
import categoryModel from "../models/categoryModel.js";

import cloudinarySDK from "cloudinary";
const cloudinary = cloudinarySDK.v2;
//config cloudinary with url
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createCategory(req, res) {
  try {
    console.log(req.body);
    console.log(req.files);
    // return res.status(200).json({
    //   message: "Category created successfully",
    // });
    //check if title already exists
    const titleExists = await categoryModel.findOne({ title: req.body.title });
    if (titleExists) {
      return res.status(409).send("Category already exists");
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
      const newCategory = await categoryModel({
        ...req.body,
        uid: req.user.uid,
        image: result.secure_url,
      });
      newCategory.save((err, result) => {
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

export async function updateCategory(req, res) {
  try {
    console.log(req.params.catagory, req.body, req.files);
    //check if image is provided
    if (req.files.image) {
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
      const updatedCategory = await categoryModel.findByIdAndUpdate(
        req.params.catagory,
        { ...req.body, image: result.secure_url },
        { new: true }
      );
      res.json(updatedCategory);
    } else {
      const updatedCategory = await categoryModel.findByIdAndUpdate(
        req.params.catagory,
        req.body,
        { new: true }
      );
      res.json(updatedCategory);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getCategory(req, res) {
  try {
    //do a case insensitive search
    const category = await categoryModel
      .findOne({ title: { $regex: `^${req.params.catagory}$`, $options: "i" } })
      .sort({ title: -1 });
    res.send(category);
  } catch (err) {
    console.log(err);
  }
}
export async function getAllCategories(req, res) {
  try {
    const allCategories = await categoryModel.find({}).sort({ title: -1 });
    res.send(allCategories);
  } catch (err) {
    console.log(err);
  }
}
