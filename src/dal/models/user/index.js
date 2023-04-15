import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
    email: {type: String},
    password: {type: String},
    first_name: {type: String},
    last_name: {type: String},
}, {
    timestamps: true
})

// userSchema.plugin(uniqueValidator)
const userModel = mongoose.model("users", userSchema)
export default userModel;