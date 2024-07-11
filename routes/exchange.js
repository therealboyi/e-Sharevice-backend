// routes/exchange.js
import express from 'express';
import {
  getAllExchangeItems,
  createExchangeItem,
  updateExchangeItem,
  deleteExchangeItem
} from '../controllers/exchangeController.js';

const router = express.Router();

router.get('/exchange-items', getAllExchangeItems);
router.post('/exchange-items', createExchangeItem);
router.put('/exchange-items/:id', updateExchangeItem);
router.delete('/exchange-items/:id', deleteExchangeItem);

export default router;
