import mongoose from "mongoose";

const configurationSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    config: {
      grass: { type: String },
      mode: { type: String },
      size: { type: Number },
      ground: { type: String },
      location: { type: String },
      liters_per_minute: { type: Number },
      light: { type: String },
    }
  },
  {
    timestamps: true,
  }
);

const configurationModel = mongoose.model("configurations", configurationSchema);
export default configurationModel;
