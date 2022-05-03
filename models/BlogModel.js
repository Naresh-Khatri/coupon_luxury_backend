import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["store", "normal"],
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    smallDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
    },
    featured: {
      type: Boolean,
    },
    coverImg: {
      type: String,
    },
    thumbnailImg: {
      type: String,
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
    metaSchema: {
      type: String,
      // required: true,
    },
    uid: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
