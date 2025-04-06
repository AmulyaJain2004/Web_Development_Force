import express from "express";
import { protect, adminOnly } from "../middlewares/authmiddleware.js"; // Middleware to protect routes
import { getUsers, getUserById } from "../controllers/userController.js"; // Import user controller functions
const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/:id", protect, getUserById); // Get user by ID

export default router;