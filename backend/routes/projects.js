import express from 'express';
import protect from '../middleware/auth.js';
import { getProjects, createProject, deleteProject, getProjectById, addProjectMember, removeProjectMember } from '../controllers/projectController.js';

const router = express.Router();

router.get('/',    protect, getProjects);
router.post('/',   protect, createProject);
router.delete('/:id', protect, deleteProject);
router.get('/:id', protect, getProjectById);
router.put('/:id/members', protect, addProjectMember);
router.delete('/:id/members/:userId', protect, removeProjectMember);

export default router;