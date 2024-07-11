// routes/exchange.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    getAllExchangeItems,
    createExchangeItem,
    updateExchangeItem,
    deleteExchangeItem
} from '../controllers/exchangeController.js';

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

router.get('/exchange-items', getAllExchangeItems);
router.post('/exchange-items', upload.single('image'), createExchangeItem); 
router.put('/exchange-items/:id', upload.single('image'), updateExchangeItem);
router.delete('/exchange-items/:id', deleteExchangeItem);

export default router;