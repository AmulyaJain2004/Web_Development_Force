import express from 'express';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';
import { exportTasksReport, exportUsersReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/export/tasks', protect, adminOnly, exportTasksReport); // Export all tasks as Excel/PDF
router.get('/export/users', protect, adminOnly, exportUsersReport); // Export user-task report

export default router;
