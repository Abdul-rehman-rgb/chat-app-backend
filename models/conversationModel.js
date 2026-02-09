import mongoose from "mongoose";

const conversationModel = new mongoose.Schema({
    // Participants mein un do users ki ID hogi jo chat kar rahe hain
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Ye User model se link hai
        }
    ],
    // Har message ki ID is array mein push hoti jayegi
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message", // Ye Message model se link hai
            default: []
        }
    ]
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", conversationModel);
export default Conversation;