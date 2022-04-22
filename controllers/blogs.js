import streamifier from "streamifier";
import blogModel from "../models/BlogModel.js";
import storeModel from "../models/storeModel.js";

import cloudinary from "../config/cloudinaryConfig.js";
import imageKit from "../config/imagekitConfig.js";
import { removeImgFromImageKit } from "../config/imagekitConfig.js";

export async function getPublicBlogs(req, res) {
  try {
    const allBlogs = await blogModel.find({active:true}).sort({ createdAt: -1 });
    res.send(allBlogs);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllBlogs(req, res) {
  try {
    const allBlogs = await blogModel.find({}).sort({ createdAt: -1 });
    res.send(allBlogs);
  } catch (err) {
    console.log(err);
  }
}

export async function getBlog(req, res) {
  try {
    // console.log(req.params.blogId);
    //do a case insensitive search
    const blog = await blogModel.findById(req.params.blogModel);
    res.send(blog);
  } catch (err) {
    console.log(err);
  }
}
export async function getBlogWithSlug(req, res) {
  try {
    //do a case insensitive search
    const blog = await blogModel.findOne({ slug: req.params.blogSlug });
    res.send(blog);
  } catch (err) {
    console.log(err);
  }
}

export async function createBlog(req, res) {
  try {
    // console.log(req.body);
    //upload coverImg and thumbnailImg to imageKit
    const promises = [
      imageKit.upload({
        file: req.files.coverImg.data,
        fileName: req.body.slug,
      }),
      imageKit.upload({
        file: req.files.thumbnailImg.data,
        fileName: req.body.slug,
      }),
    ];
    const results = await Promise.all(promises);
    // console.log(results);
    //create new blog
    const newBlog = await blogModel({
      ...req.body,
      coverImg: results[0].url,
      thumbnailImg: results[1].url,
      type: req.body.blogType,
      store: req.body.blogType == "store" ? req.body.storeId : null,
      uid: req.user.uid,
    });

    newBlog.save((err, savedBlog) => {
      if (err) {
        console.log(err);
        if (err.code === 11000) {
          return res.status(409).json({
            message: "Slug already exists",
          });
        }
        return res.status(400).send("Invalid Request");
      }
      //blog saved now add it to store model if storeId provided
      if (req.body.storeId) {
        storeModel.updateOne(
          { _id: req.body.storeId },
          { $push: { blogs: savedBlog } },
          (err, savedStore) => {
            if (err) {
              console.log(err);
              return res.status(400).send("Invalid Request");
            }
          }
        );
        res.json(savedBlog);
      } else {
        res.json(savedBlog);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid Request");
  }
}

export async function updateBlog(req, res) {
  try {
    console.log(req.params.blogId, req.body, req.files);
    //check if image is provided
    if (req.files && req.files.coverImg) {
      //upload coverImg and thumbnailImg to imageKit
      const promises = [
        imageKit.upload({
          file: req.files.coverImg.data,
          fileName: req.body.slug,
        }),
        imageKit.upload({
          file: req.files.thumbnailImg.data,
          fileName: req.body.slug,
        }),
      ];
      const results = await Promise.all(promises);
      //update blog

      const updatedBlog = await blogModel.findByIdAndUpdate(
        req.params.blogId,
        {
          ...req.body,
          coverImg: results[0].url,
          thumbnailImg: results[1].url,
          type: req.body.blogType,
          store: req.body.blogType == "store" ? req.body.storeId : null,
          uid: req.user.uid,
        },
        { new: false }
      );
      //delete coverImg and thumbnailImg from imageKit
      const oldCoverImg =
        updatedBlog.coverImg.split("/")[
          updatedBlog.coverImg.split("/").length - 1
        ];
      const oldThumbnaiImg =
        updatedBlog.thumbnailImg.split("/")[
          updatedBlog.thumbnailImg.split("/").length - 1
        ];
      removeImgFromImageKit(oldCoverImg);
      removeImgFromImageKit(oldThumbnaiImg);
      res.json(updatedBlog);
    } else {
      //update blog
      const updatedBlog = await blogModel.findByIdAndUpdate(
        req.params.blogId,
        { ...req.body, uid: req.user.uid },
        { new: true }
      );
      res.json(updatedBlog);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function deleteBlog(req, res) {
  try {
    const deletedBlog = await blogModel.findByIdAndRemove(req.params.blogId);

    //delete blog from store model
    if (deletedBlog.type === "store") {
      storeModel.updateOne(
        { _id: deletedBlog.store },
        { $pull: { blogs: deletedBlog._id } },
        (err, savedStore) => {
          if (err) {
            console.log(err);
            return res.status(400).send("Invalid Request");
          }
        }
      );
    }
    //delete coverImg and thumbnailImg from imageKit
    const oldCoverImg =
      deletedBlog.coverImg.split("/")[deletedBlog.coverImg.split("/").length - 1];
    const oldThumbnaiImg =
      deletedBlog.thumbnailImg.split("/")[
        deletedBlog.thumbnailImg.split("/").length - 1
      ];
    removeImgFromImageKit(oldCoverImg);
    removeImgFromImageKit(oldThumbnaiImg);
    res.json(deletedBlog);
  } catch (err) {
    console.log(err);
  }
}
