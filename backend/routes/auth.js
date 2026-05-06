import express from 'express';
import { body } from 'express-validator';
import { signup, login} from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], signup);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

router.get('/users', async (req, res) => {
   const users = await User.find();
   res.json(users);
});

export default router;