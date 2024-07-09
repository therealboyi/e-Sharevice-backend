// routes/auth.js
import express from 'express';
import { register, login, checkEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/check-email', checkEmail);

export default router;
