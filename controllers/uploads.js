
import imageKit from "../config/imagekitConfig.js";
import { removeImgFromImageKit } from "../config/imagekitConfig.js";

//TODO: use removeImgFromImageKit to delete image from imagekit

export async function newUpload(req, res) {
  try {
    console.log(req.body);
    const result = await imageKit.upload({
      file: req.files.coverImg.data,
      fileName: "test",
      folder: "uploads",
    });
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
}
export async function getUploads(req, res) {
  try {
    const result = await imageKit.listFiles({
      path: "uploads",
      sort: "DESC_CREATED",
      skip: req.query.skip || 0,
      limit: req.query.limit || 10,
    });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
}
export async function deleteUpload(req, res) {
  try {
    const result = await imageKit.deleteFile(req.params.uploadId);
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
}
