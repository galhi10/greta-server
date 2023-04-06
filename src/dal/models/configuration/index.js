import mongoose from "mongoose";

const configurationSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    grass: { type: String },
    mode: { type: String },
    size: { type: Number },
    ground: { type: String },
    location: { type: String },
    liter_per_minute: { type: Number },
    light: { type: String },
  },
  {
    timestamps: true,
  }
);

const configurationModel = mongoose.model("configuration", configurationSchema);
export default configurationModel;
