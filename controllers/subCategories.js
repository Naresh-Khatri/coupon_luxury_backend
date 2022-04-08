import streamifier from "streamifier";
import categoryModel from "../models/categoryModel.js";
import subCategoryModel from "../models/subCategoryModel.js";

export async function getAllSubCategories(req, res) {
  try {
    const allCategories = await subCategoryModel
      .find({})
      .sort({ subCategoryName: -1 });
      console.log(allCategories)
    res.send(allCategories);
  } catch (err) {
    console.log(err);
  }
}

export async function getSubCategory(req, res) {
  try {
    console.log(req.params.subCategoryId);
    //do a case insensitive search
    const subCategory = await subCategoryModel
      .findById(req.params.subCategoryId)
      .sort({ subCategoryName: -1 });
    res.send(subCategory);
  } catch (err) {
    console.log(err);
  }
}

export async function createSubCategory(req, res) {
  try {
    // console.log(req.body);
    // return res.status(200).json({
    //   message: "subCategory created successfully",
    // });
    //create new subCategory
    const newsubCategory = await subCategoryModel({
      ...req.body,
      category: req.body.categoryId,
      uid: req.user.uid,
    });
    //save subCategory in the category collection
    const category = await categoryModel.findById(req.body.categoryId);
    // console.log('found category', category);
    category.subCategories.push(newsubCategory);
    category.save((err, savedCategory) => {
      if (err) {
        console.log("error saving sub in category", err);
      }
      // console.log("saved sub in category", savedCategory);
      newsubCategory.save((err, result) => {
        if (err) {
          console.log(err);
          if (err.code === 11000) {
            return res.status(409).json({
              message: "subCategory already exists",
            });
          }
          return res.status(400).send("Invalid Request");
        }
        res.json(result);
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid Request");
  }
}

export async function updateSubCategory(req, res) {
  try {
    // console.log(req.params.subCategoryId, req.body, req.files);
    //check if image is provided
    const updatedsubCategory = await subCategoryModel.findByIdAndUpdate(
      req.params.subCategoryId,
      req.body,
      { new: true }
    );
    res.json(updatedsubCategory);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteSubCategory(req, res) {
  try {
    const deletedCategory = await subCategoryModel.findByIdAndRemove(
      req.params.subCategoryId
    );

    res.json(deletedCategory);
  } catch (err) {
    console.log(err);
  }
}
