import mongoose from "mongoose";

const devicesSchema = new mongoose.Schema(
    {
        user_id: { type: String },
        sensor: {
            id: { type: Number },
            location: { type: String },
            model: { type: String },
        },
        humidity: { type: Number }
    },
    {
        timestamps: true,
    }
);

const devicesModel = mongoose.model("devices", devicesSchema);
export default devicesModel;