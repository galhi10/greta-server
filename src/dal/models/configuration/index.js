import mongoose from "mongoose";

const configurationSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    config: {
      country: { type: String },
      city: { type: String },
      lat: { type: Number },
      long: { type: Number },
    }
  },
  {
    timestamps: true,
  }
);

const configurationModel = mongoose.model("configurations", configurationSchema);
export default configurationModel;
