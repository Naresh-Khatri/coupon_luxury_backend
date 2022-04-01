import streamifier from "streamifier";
import blogModel from "../models/BlogModel.js";
import storeModel from "../models/storeModel.js";

import cloudinary from "../config/cloudinaryConfig.js";

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
    console.log(req.params.blogId);
    //do a case insensitive search
    const blog = await blogModel.findById(req.params.blogModel);
    res.send(blog);
  } catch (err) {
    console.log(err);
  }
}

export async function createBlog(req, res) {
  try {
    console.log(req.body);
    //upload coverImg and thumbnailImg to cloudinary
    let streamUpload = (image) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(image.data).pipe(stream);
      });
    };
    const promises = [
      streamUpload(req.files.coverImg),
      streamUpload(req.files.thumbnailImg),
    ];
    const results = await Promise.all(promises);
    console.log(results);
    //create new blog
    const newBlog = await blogModel({
      ...req.body,
      coverImg: results[0].secure_url,
      thumbnailImg: results[1].secure_url,
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
      //upload buffer to cloudinary
      let streamUpload = (image) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });

          streamifier.createReadStream(image.data).pipe(stream);
        });
      };
      const promises = [
        streamUpload(req.files.coverImg),
        streamUpload(req.files.thumbnailImg),
      ];
      const results = await Promise.all(promises);
      console.log(results);
      //update blog

      const updatedBlog = await blogModel.findByIdAndUpdate(
        req.params.blogId,
        {
          ...req.body,
          coverImg: results[0].secure_url,
          thumbnailImg: results[1].secure_url,
          type: req.body.blogType,
          store: req.body.blogType == "store" ? req.body.storeId : null,
          uid: req.user.uid,
        },
        { new: true }
      );
      console.log(updatedBlog);
      res.json(updatedBlog);
    } else {
      //update blog
      const updatedBlog = await blogModel.findByIdAndUpdate(
        req.params.blogId,
        { ...req.body, uid: req.user.uid },
        { new: true }
      );
      console.log(updatedBlog);
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
    res.json(deletedBlog);
  } catch (err) {
    console.log(err);
  }
}
