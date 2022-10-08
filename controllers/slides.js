import imageKit from "../config/imagekitConfig.js";
import { removeImgFromImageKit } from "../config/imagekitConfig.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import serializer from "../utils/serializer.js";

export async function createSlide(req, res) {
  try {
    console.log(req.body);
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

    const data = serializer({
      ...req.body,
      imgURL: result.url,
      uid: req.user.uid,
    });
    const newSlide = await prisma.slide.create({
      data,
    });
    res.json(newSlide);
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

      const oldImage = await prisma.slide.findUnique({
        where: {
          id: parseInt(req.params.slideId),
        },
      });
      // console.log(result);
      const data = serializer({
        ...req.body,
        imgURL: result.url,
      });
      const updatedSlide = await prisma.slide.update({
        where: {
          id: parseInt(req.params.slideId),
        },
        data,
      });

      console.log(updatedSlide);
      //now remove the old image from imageKit
      //grab the old image from the db
      const oldImageName =
        oldImage.imgURL.split("/")[oldImage.imgURL.split("/").length - 1];
      //remove the old image from imageKit
      removeImgFromImageKit(oldImageName);
      res.json(updatedSlide);
    } else {
      console.log("no image provided");
      const data = serializer(req.body);
      const updatedSlide = await prisma.slide.update({
        where: {
          id: parseInt(req.params.slideId),
        },
        data,
      });
      res.json(updatedSlide);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getPublicSlides(req, res) {
  try {
    const slides = await prisma.slide.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        title: true,
        imgURL: true,
        active: true,
      },
      orderBy: {
        order: "asc",
      },
    });
    res.send(slides);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllSlides(req, res) {
  try {
    const slides = await prisma.slide.findMany({
      orderBy: {
        order: "asc",
      },
    });
    res.send(slides);
  } catch (err) {
    console.log(err);
  }
}

export async function getSlide(req, res) {
  try {
    const slide = await prisma.slide.findUnique({
      where: {
        id: parseInt(req.params.slideId),
      },
    });
    res.send(slide);
  } catch (err) {
    console.log(err);
  }
}
export async function deleteSlide(req, res) {
  try {
    console.log(req.body);
    //TODO: check if double fetch necessary
    const deletedSlide = await prisma.slide.delete({
      where: {
        id: parseInt(req.params.slideId),
      },
    });

    //now remove the old image from imageKit
    //grab the old image from the db
    const oldImageName =
      deletedSlide.imgURL.split("/")[deletedSlide.imgURL.split("/").length - 1];
    console.log("trying to delete the following image", deletedSlide);
    //remove the old image from imageKit
    removeImgFromImageKit(oldImageName);
    res.json(deletedSlide);
  } catch (err) {
    console.log(err);
  }
}
