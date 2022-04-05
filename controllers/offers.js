import streamifier from "streamifier";
import categoryModel from "../models/categoryModel.js";
import subCategoryModel from "../models/subCategoryModel.js";
import storeModel from "../models/storeModel.js";
import offerModel from "../models/offerModel.js";

export async function getAllOffers(req, res) {
  try {
    const allOffers = await offerModel
      .find()
      .populate("store", "-pageHTML -__v ")
      .sort({ storeName: -1 });
    res.send(allOffers);
  } catch (err) {
    console.log(err);
  }
}

export async function getOffer(req, res) {
  try {
    //do a case insensitive search
    const offer = await offerModel
      .findById(req.params.offerId)
      .populate("store", "-__v ")
      .sort({ storeName: -1 });
    res.send(offer);
  } catch (err) {
    console.log(err);
  }
}

export async function createOffer(req, res) {
  try {
    // return res.status(200).json({
    //   message: "subCategory created successfully",
    // });
    //create new subCategory
    const newOffer = await offerModel({
      ...req.body,
      uid: req.user.uid,
    });

    //now save it in store, category and subCategory collections
    const store = await storeModel.findById(req.body.store);
    store.offers.push(newOffer);
    await store.save();
    console.log("saved in store", store.offers);
    const category = await categoryModel.findById(req.body.category);
    category.offers.push(newOffer);
    await category.save();
    console.log("saved in category", category.offers);
    const subCategory = await subCategoryModel.findById(req.body.subCategory);
    subCategory.offers.push(newOffer);
    await subCategory.save();
    console.log("saved in sub cat", subCategory.offers);

    //now save it in offer collection
    const savedOffer = await newOffer.save();
    console.log("saved in offer", savedOffer.offers);

    res.json(savedOffer);
    // store.save((err, savedStore) => {
    //   if (err) {
    //     console.log("error saving offer in store", err);
    //   }
    //   newOffer.save((err, savedOffer) => {
    //     if (err) {
    //       console.log(err);
    //       if (err.code === 11000) {
    //         return res.status(409).json({
    //           message: "Offer already exists",
    //         });
    //       }
    //       return res.status(400).send("Invalid Request");
    //     }
    //     res.json(savedOffer);
    //   });
    // });
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid Request");
  }
}

export async function updateOffer(req, res) {
  try {
    console.log(req.params.offerId, req.body, req.files);
    //check if image is provided
    const updatedOffer = await offerModel.findByIdAndUpdate(
      req.params.offerId,
      req.body,
      { new: true }
    );
    res.json(updatedOffer);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteOffer(req, res) {
  try {

    const offerToBeDeleted = await offerModel.findById(req.params.offerId);
    //delete offer from store, category and subCategory collections
    const store = await storeModel.findById(offerToBeDeleted.store);
    store.offers.pull(req.params.offerId);
    await store.save();
    const category = await categoryModel.findById(offerToBeDeleted.category);
    category.offers.pull(req.params.offerId);
    await category.save();
    const subCategory = await subCategoryModel.findById(offerToBeDeleted.subCategory);
    subCategory.offers.pull(req.params.offerId);
    await subCategory.save();

    const deletedOffer = await offerModel.findByIdAndRemove(req.params.offerId);

    res.json(deletedOffer);
  } catch (err) {
    console.log(err);
  }
}
