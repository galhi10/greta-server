import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
    {
        user_id: { type: String },
        sensor: {
            id: { type: Number },
        }
    },
    {
        timestamps: true,
    }
);

const sensorModel = mongoose.model("sensors", sensorSchema);
export default sensorModel;