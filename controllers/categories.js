import streamifier from "streamifier";
import categoryModel from "../models/categoryModel.js";
import subCategoryModel from "../models/subCategoryModel.js";

import cloudinary from "../config/cloudinaryConfig.js";
import imageKit from "../config/imagekitConfig.js";

export async function getPublicCategories(req, res) {
  try {
    const allCategories = await categoryModel
      .find({ active: true })
      .sort({ categoryName: 1 });
    res.send(allCategories);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllCategories(req, res) {
  try {
    const allCategories = await categoryModel
      .find()
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
      })
      .populate("offers")
      .sort({ categorySlug: -1 });
    res.send(category);
  } catch (err) {
    console.log(err);
  }
}

export async function createCategory(req, res) {
  try {
    // console.log(req.body);
    // console.log(req.files);
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
      // console.log(result);
      const newCategory = await categoryModel({
        ...req.body,
        uid: req.user.uid,
        image: result.url,
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
    // console.log(req.params.categoryId, req.body, req.files);
    //check if image is provided
    if (req.files && req.files.image) {
      //upload buffer to cloudinary
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

      const updatedCategory = await categoryModel.findByIdAndUpdate(
        req.params.categoryId,
        { ...req.body, image: result.url },
        { new: false }
      );
      //now remove the old image from imageKit
      //grab the old image from the db
      const oldImageName =
        updatedCategory.image.split("/")[updatedCategory.image.split("/").length - 1];
      //remove the old image from imageKit
      await removeImgFromImageKit(oldImageName);
      res.json(updatedCategory);
    } else {
      categoryModel
        .findByIdAndUpdate(req.params.categoryId, req.body, { new: true })
        .then((result) => {
          // console.log(result);
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
    //do a case insensitive search
    const category = await categoryModel
      .find({
        categoryName: { $regex: regex, $options: "is" },
      })
      .select("categoryName slug -_id");
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

const removeImgFromImageKit = (imageName) => {
  return new Promise(async (resolve, reject) => {
    try {
      //find the image in imageKit
      const images = await imageKit.listFiles({ name: imageName });
      //if there is an image, delete it
      if (images.length>0) await imageKit.deleteFile(images[0].fileId);
      resolve();
    } catch (err) {
      console.log(err);
      reject();
    }
  });
};
