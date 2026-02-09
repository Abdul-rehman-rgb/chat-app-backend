import express from "express";
import messageController from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Pehle authentication check hogi, phir messages milenge
router.get("/:id", isAuthenticated, messageController.getMessage);
router.post("/send/:id", isAuthenticated, upload.single("file"), messageController.sendMessage);

export default router;