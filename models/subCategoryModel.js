import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema({
  image: {
    type: String,
  },
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
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  subCategoryName: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
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

  pageHTML: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("SubCategory", SubCategorySchema);
