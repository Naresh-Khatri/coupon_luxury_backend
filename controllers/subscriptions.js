import streamifier from "streamifier";
import subscriberModel from "../models/subscriber.js";

export async function getAllSubs(req, res) {
  try {
    const allSubs = await subscriberModel.find({}).sort({ createdAt: -1 });
    console.log(allSubs);
    res.send(allSubs);
  } catch (err) {
    res.status(400).send("Invalid Request");
    console.log(err);
  }
}

export async function getSub(req, res) {
  try {
    console.log(req.params.subId);
    const subscriber = await subscriberModel.findById(req.params.subCategoryId);
    res.send(subscriber);
  } catch (err) {
    res.status(400).send("Invalid Request");
    console.log(err);
  }
}

export async function createSub(req, res) {
  try {
    const newSub = await subscriberModel({
      ...req.body,
    });
    newSub.save((err, result) => {
      if (err) {
        res.status(400).send("Invalid Request");
        console.log(err);
      }
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid Request");
  }
}

export async function updateSub(req, res) {
  try {
    // console.log(req.params.subCategoryId, req.body, req.files);
    //check if image is provided
    const updatedSub = await subscriberModel.findByIdAndUpdate(
      req.params.subId,
      req.body,
      { new: true }
    );
    res.json(updatedSub);
  } catch (err) {
    res.status(400).send("Invalid Request");
    console.log(err);
  }
}

export async function deleteSub(req, res) {
  try {
    const deletedSub = await subscriberModel.findByIdAndRemove(
      req.params.subId
    );

    res.json(deletedSub);
  } catch (err) {
    res.status(400).send("Invalid Request");
    console.log(err);
  }
}
