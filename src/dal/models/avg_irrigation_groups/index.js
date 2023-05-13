import mongoose from "mongoose";
const irrigationScheduleSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    groups: {
      location: { type: String },
      light: { type: String },
      grass: { type: String },
      ground: { type: String },
      evaporation_prec: { type: Number },
      liter_per_minute: { type: Number },
      updates: { type: Number },
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
