import mongoose from "mongoose";

const slideSchema = new mongoose.Schema(
  {
    imgURL: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    order: {
      type: Number,
    },
    link: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    uid: {
      type: String,
    },
    imgAlt: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Slide", slideSchema);
