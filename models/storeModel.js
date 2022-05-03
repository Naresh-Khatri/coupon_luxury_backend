import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  uid: {
    type: String,
    required: true,
  },
  // categoryName: {
  //   type: String,
  // },
  // subCategoryName: {
  //   type: String,
  // },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  storeURL: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  storeName: {
    type: String,
    unique: true,
    required: true,
  },
  pageHTML: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
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

export default mongoose.model("Store", StoreSchema);
