import mongoose from "mongoose";

const devicesSchema = new mongoose.Schema(
    {
        user_id: { type: String },
        config: {
            id: { type: Number },
            mode: { type: String },
            name: { type: String },
            grass: { type: String },
            size: { type: Number },
            min_humidity: { type: Number },
            max_humidity: { type: Number },
            ground: { type: String },
            liters_per_minute: { type: Number },
            light: { type: String },
        },
        humidity: { type: Number }
    },
    {
        timestamps: true,
    }
);

const devicesModel = mongoose.model("devices", devicesSchema);
export default devicesModel;