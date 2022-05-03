import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  country: {
    type: String,
  },
  uid: {
    type: String,
  },
  //this field will be foreign key for category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  TnC: {
    type: String,
    required: true,
  },
  URL: {
    type: String,
    required: true,
  },
  affURL: {
    type: String,
    required: true,
  },
  offerType: {
    type: String,
    enum: ["coupon", "deal"],
    required: true,
  },
  discountType:{
    type: String,
    enum: ["percentage", "amount"],
    required: true,
  },
  discountValue:{
    type: String,
    required: true,
  },
  couponCode: {
    type: String,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  metaTitle: {
    type: String,
    // required: true,
  },
  metaDescription: {
    type: String,
    // required: true,
  },
  metaKeywords: {
    type: String,
    // required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
},
{ timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
