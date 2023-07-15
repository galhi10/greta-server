import mongoose from "mongoose";

const devicesSchema = new mongoose.Schema(
    {
        user_id: { type: String },
        sensor: {
            id: { type: Number },
            location_country: { type: String },
            location_city: { type: String },
            name: { type: String },
            mode: { type: String },
        },
        humidity: { type: Number }
    },
    {
        timestamps: true,
    }
);

const devicesModel = mongoose.model("devices", devicesSchema);
export default devicesModel;