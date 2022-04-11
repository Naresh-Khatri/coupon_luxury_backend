import mongoose from "mongoose";

const slideSchema = new mongoose.Schema({
  imgURL:{
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  order:{
    type: Number,
  },
  link:{
    type: String,
    required:true,
  },
  active:{
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uid: {
    type: String,
  },
});

export default mongoose.model("Slide", slideSchema);
