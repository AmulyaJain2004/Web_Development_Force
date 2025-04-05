import express from "express";
import { protect, adminOnly } from "../middlewares/authmiddleware.js"; // Middleware to protect routes
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/authController";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); // Get User Profile
router.put("/profile", protect, updateUserProfile); // Update User Profile

export default router;