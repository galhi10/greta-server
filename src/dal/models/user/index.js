import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String },
    password: { type: String },
    first_name: { type: String },
    last_name: { type: String },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);
export default userModel;
