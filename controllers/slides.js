import slideModel from "../models/slideModel.js";
import imageKit from "../config/imagekitConfig.js";
import { removeImgFromImageKit } from "../config/imagekitConfig.js";

export async function createSlide(req, res) {
  try {
    console.log(req.body);
    // console.log(req.files);

    // return res.status(200).json({
    //   message: "Category created successfully",
    //   data: res,
    // });

    const result = await imageKit.upload({
      file: req.files.imgURL.data,
      fileName: "slide-" + req.body.title,
      extensions: [
        {
          name: "google-auto-tagging",
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    });
    console.log(result);

    const newSlide = await slideModel({
      ...req.body,
      uid: req.user.uid,
      imgURL: result.url,
    });
    newSlide.save((err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send("Invalid Request");
      }
      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid Request");
  }
}

export async function updateSlide(req, res) {
  try {
    console.log(req.params.slideId, req.body, req.files);
    //check if image is provided
    if (req.files && req.files.imgURL) {
      //upload buffer to imageKit
      const result = await imageKit.upload({
        file: req.files.imgURL.data,
        fileName: "slide-" + req.body.title,
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      });
      // console.log(result);
      const updatedSlide = await slideModel.findByIdAndUpdate(
        req.params.slideId,
        { ...req.body, imgURL: result.url },
        { new: false }
      );
      console.log(updatedSlide);
      //now remove the old image from imageKit
      //grab the old image from the db
      const oldImageName =
        updatedSlide.imgURL.split("/")[
          updatedSlide.imgURL.split("/").length - 1
        ];
      //remove the old image from imageKit
      await removeImgFromImageKit(oldImageName);
      res.json(updatedSlide);
    } else {
      console.log("no image provided");
      const updatedSlide = await slideModel.findByIdAndUpdate(
        req.params.slideId,
        req.body,
        { new: true }
      );
      // console.log(req.body.category);
      // console.log(updatedSlide.category);
      // console.log("updated record", updatedSlide);
      res.json(updatedSlide);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getPublicSlides(req, res) {
  try {
    //do a case insensitive search
    const slides = await slideModel.find({active:true}).sort({ order: -1 });
    res.send(slides);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllSlides(req, res) {
  try {
    //do a case insensitive search
    const slides = await slideModel.find().sort({ order: -1 });
    res.send(slides);
  } catch (err) {
    console.log(err);
  }
}

export async function getSlide(req, res) {
  try {
    //do a case insensitive search
    const slides = await slideModel.findById(req.params.slideId);
    res.send(slides);
  } catch (err) {
    console.log(err);
  }
}
export async function deleteSlide(req, res) {
  try {
    console.log(req.body);
    const deletedSlide = await slideModel.findByIdAndRemove(req.params.slideId);
    //now remove the old image from imageKit
    //grab the old image from the db
    const oldImageName =
      deletedSlide.imgURL.split("/")[deletedSlide.imgURL.split("/").length - 1];
    //remove the old image from imageKit
    await removeImgFromImageKit(oldImageName);
    res.json(deletedSlide);
  } catch (err) {
    console.log(err);
  }
}
