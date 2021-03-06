import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },

    categoryName: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    imgAlt: {
      type: String,
    },
    offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
    subCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    ],
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
    uid: {
      type: String,
      required: true,
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

export default mongoose.model("Category", CategorySchema);
