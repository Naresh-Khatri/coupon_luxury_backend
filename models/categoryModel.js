import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  image: {
    type: String,
  },
  uid: {
    type: String,
    required: true,
  },
  title: {
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

  description: {
    type: String,
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

export default mongoose.model("Category", CategorySchema);
