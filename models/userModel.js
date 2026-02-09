import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"], // Added values to your enum
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const User = mongoose.model("User", userModel);

export default User;