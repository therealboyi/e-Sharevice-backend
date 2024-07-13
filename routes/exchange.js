import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    getAllExchangeItems,
    createExchangeItem,
    updateExchangeItem,
    deleteExchangeItem,
    getExchangeItemById,
    reserveExchangeItem
} from '../controllers/exchangeController.js';
import {
    authenticateToken
} from '../authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage
});

router.get('/exchange-items', authenticateToken, getAllExchangeItems);
router.get('/exchange-items/:id', getExchangeItemById); // Remove authenticateToken to allow public access
router.post('/exchange-items', authenticateToken, upload.single('image'), createExchangeItem);
router.put('/exchange-items/:id', authenticateToken, upload.single('image'), updateExchangeItem);
router.delete('/exchange-items/:id', authenticateToken, deleteExchangeItem);
router.put('/exchange-items/:id/reserve', authenticateToken, reserveExchangeItem);

export default router;
