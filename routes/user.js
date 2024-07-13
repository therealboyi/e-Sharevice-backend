// routes/user.js
import express from 'express';
import {
    getCurrentUser
} from '../controllers/userController.js';
import {
    authenticateToken
} from '../authMiddleware.js';

const router = express.Router();

router.get('/current-user', authenticateToken, getCurrentUser);

export default router;