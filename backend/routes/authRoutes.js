import express from 'express';
import { loginUser, registerUser, getUsers } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, authorize('admin', 'manager'), getUsers);

export default router;
