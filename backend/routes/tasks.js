import express from 'express';
import protect from '../middleware/auth.js';
import { getTasks, createTask, updateTask, deleteTask, getDashboardStats } from '../controllers/taskController.js';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/:projectId', protect, getTasks);
router.post('/:projectId', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;