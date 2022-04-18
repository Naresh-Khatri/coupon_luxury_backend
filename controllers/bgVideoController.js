import imageKit from "../config/imagekitConfig.js";
import { removeImgFromImageKit } from "../config/imagekitConfig.js";

import bgVideoModel from "../models/bgVideoModel.js";

export async function updateVideo(req, res) {
  try {
    console.log(req.files.video);
    // return res.status(200).send('ok');
    //upload video file to  to imageKit
    const result = await imageKit.upload({
      file: req.files.video.data,
      fileName: "bgVideo-" + req.files.video.name,
      extensions: [
        {
          name: "google-auto-tagging",
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    });
    console.log(result);
    const updatedVideo = await bgVideoModel.findOne();
    updatedVideo.url = result.url;
    updatedVideo.uid = req.user.uid;

    console.log(updatedVideo);
    // return res.status(200).send('ok');
    updatedVideo.save((err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send("Invalid Request");
      }
      res.json(result);
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getVideo(req, res) {
  try {
    const video = await bgVideoModel.find();
    res.send(video[0]);
  } catch (err) {
    console.log(err);
  }
}
