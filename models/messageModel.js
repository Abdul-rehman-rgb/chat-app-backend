import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId, // Ye User ki unique ID store karega
        ref: "User", // Ye wahi naam hona chahiye jo aapne User model mein rakha hai
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        //required: true
    },
    fileUrl: {
        type: String, // Document ya Image ka link yahan save hoga
        default: ""
    },
    fileType: {
        type: String, // "image", "pdf", "video" etc.
        default: "text"
    },
    fileName: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageModel);
export default Message;