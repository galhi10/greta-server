import mongoose from "mongoose";

const irrigationScheduleSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    schedule: { type: Array },
  },
  {
    timestamps: true,
  }
);

const irrigationScheduleModel = mongoose.model(
  "irrigation_schedule",
  irrigationScheduleSchema
);
export default irrigationScheduleModel;
