import express from 'express';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData
} from '../controllers/taskController.js';
const router = express.Router();

// Task Mamnagement Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); // Get all tasks (Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); // Get task by ID
router.post("/", protect, adminOnly, createTask); // Create a task (Admin only)
router.put("/:id", protect, updateTask); // Update task details
router.delete("/:id", protect, adminOnly, deleteTask); // Delete a task (Admin only)
router.put("/:id/status", protect, updateTaskStatus); // Update task status
router.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist

export default router;
