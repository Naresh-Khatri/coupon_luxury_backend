import streamifier from "streamifier";
import categoryModel from "../models/categoryModel.js";
import subCategoryModel from "../models/subCategoryModel.js";

import cloudinary from "../config/cloudinaryConfig.js";

export async function getAllCategories(req, res) {
  try {
    const allCategories = await categoryModel
      .find({})
      .sort({ categoryName: 1 });
    res.send(allCategories);
  } catch (err) {
    console.log(err);
  }
}

export async function getCategory(req, res) {
  try {
    const category = await categoryModel
      .findById(req.params.categoryId)
      .sort({ categoryName: -1 });
    res.send(category);
  } catch (err) {
    console.log(err);
  }
}
export async function getCategoryWithName(req, res) {
  try {
    const category = await categoryModel
      .findOne({
        categoryName: { $regex: req.params.categoryName, $options: "i" },
      })
      .sort({ categoryName: -1 });
    res.send(category);
  } catch (err) {
    console.log(err);
  }
}
export async function getCategoryWithSlug(req, res) {
  try {
    const category = await categoryModel
      .findOne({
        slug: req.params.categorySlug,
      }).populate('offers')
      .sort({ categorySlug: -1 });
    res.send(category);
  } catch (err) {
    console.log(err);
  }
}

export async function createCategory(req, res) {
  try {
    console.log(req.body);
    console.log(req.files);
    // return res.status(200).json({
    //   message: "Category created successfully",
    // });
    //check if category already exists
    const categoryExists = await categoryModel.findOne({
      categoryName: req.body.categoryName,
    });
    if (categoryExists) {
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
    console.log(req.params.categoryId, req.body, req.files);
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
      const updatedCategory = await categoryModel.findByIdAndUpdate(
        req.params.categoryId,
        { ...req.body, image: result.secure_url },
        { new: true }
      );
      res.json(updatedCategory);
    } else {
      categoryModel
        .findByIdAndUpdate(req.params.categoryId, req.body, { new: true })
        .then((result) => {
          console.log(result);
          res.json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (err) {
    console.log(err);
  }
}
export async function getAutoCompleteData(req, res) {
  try {
    const { searchText } = req.body;
    const regex = new RegExp(`^${searchText}`);
    console.log(req.body)
    //do a case insensitive search
    const category = await categoryModel
      .find({
        categoryName: { $regex: regex, $options: "is" },
      })
      .select('categoryName slug -_id')
      // console.log(category)
    res.send(category);
  } catch (err) {
    console.log(err);
  }
}
export async function getSubCategories(req, res) {
  try {
    const categories = await subCategoryModel
      .find({
        category: req.params.categoryId,
      })
      .sort({ categoryName: -1 });
    res.send(categories);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteCategory(req, res) {
  try {
    const deletedCategory = await categoryModel.findByIdAndRemove(
      req.params.categoryId
    );

    res.json(deletedCategory);
  } catch (err) {
    console.log(err);
  }
}
