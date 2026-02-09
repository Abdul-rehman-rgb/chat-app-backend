import express from "express";
import userController from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/register", upload.single("profilePhoto"), userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/", isAuthenticated,userController.getOtherUsers);

export default router;