import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  url:{
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Video", VideoSchema);
