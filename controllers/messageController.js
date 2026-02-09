import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js"; // Ensure Message model exists

const sendMessage = async (req, res) => {
    try {
        const senderId = req.id; // Middleware se aa raha hai
        const receiverId = req.params.id;
        const { message } = req.body;
        
        // File handling
        let fileUrl = "";
        let fileType = "text";
        
        if (req.file) {
            // Stored in uploads/messages by multer
            fileUrl = `/uploads/messages/${req.file.filename}`;
            var originalName = req.file.originalname || "";
            // Determine file type
            if (req.file.mimetype.startsWith('image/')) {
                fileType = "image";
            } else if (req.file.mimetype === 'application/pdf') {
                fileType = "pdf";
            } else if (req.file.mimetype.startsWith('video/')) {
                fileType = "video";
            } else {
                fileType = "file";
            }
        }

        // 1. Existing conversation dhoondein
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // 2. Agar nahi hai toh nayi conversation banayein
        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // 3. Naya message create karein
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: message || "",
            fileUrl,
            fileType,
            fileName: originalName || ""
        });

        // 4. Message ID ko conversation mein push karein
        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }
        
        // Dono ko save karein
        await Promise.all([gotConversation.save(), newMessage.save()]);

        return res.status(201).json(newMessage);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id; // Jis user se chat ho rahi hai
        const senderId = req.id; // Aapki apni ID (Auth middleware se)

        // 1. Dono participants wali conversation dhoondna
        // .populate("messages") se saare message objects mil jayenge
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages"); 

        // 2. Agar pehle kabhi chat nahi hui
        if (!conversation) {
            return res.status(200).json([]);
        }

        // 3. Saare messages return karein
        return res.status(200).json(conversation.messages);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default {sendMessage, getMessage};