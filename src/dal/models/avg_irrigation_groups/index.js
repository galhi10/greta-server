import mongoose from "mongoose";
//TODO
const irrigationScheduleSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    schedule: {
      date: { type: String },
      time: { type: String },
      status: { type: String },
      humidity: { type: Number },
     },
  },
  {
    timestamps: true,
  }
);

const irrigationGroupsModel = mongoose.model(
  "avg_irrigation_groups",
  irrigationScheduleSchema
);
export default irrigationGroupsModel;
