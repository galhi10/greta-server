import mongoose from "mongoose";

const irrigationScheduleSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    schedule: [{   
      date: { type: String },
      time: { type: String },
      status: { type: String },
      humidity: { type: Number},
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
