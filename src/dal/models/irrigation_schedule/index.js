import mongoose from "mongoose";

const irrigationScheduleSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    schedule: [{
      date: { type: String },
      time: { type: String },
      status: { type: String },
      start_humidity: { type: Number },
      end_humidity: { type: Number },
      irrigation_time: { type: Number },
      irrigation_volume: { type: Number },
    }],
  },
  {
    timestamps: true,
  }
);

const irrigationScheduleModel = mongoose.model(
  "irrigation_schedules",
  irrigationScheduleSchema
);
export default irrigationScheduleModel;
