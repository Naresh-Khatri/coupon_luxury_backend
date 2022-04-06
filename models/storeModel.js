import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  uid: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  categoryName: {
    type: String,
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  subCategoryName: {
    type: String,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Store", StoreSchema);
