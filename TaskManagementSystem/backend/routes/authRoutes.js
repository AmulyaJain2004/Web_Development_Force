import express from "express";
import { protect, adminOnly } from "../middlewares/authmiddleware.js"; // Middleware to protect routes
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/authController.js";
import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); // Get User Profile
router.put("/profile", protect, updateUserProfile); // Update User Profile
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageURL = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    res.status(200).json({ imageURL });
});

export default router;