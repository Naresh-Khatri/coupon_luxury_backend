import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscriber", SubscriberSchema);
