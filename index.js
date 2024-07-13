// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import {
    fileURLToPath
} from 'url';
import authRoutes from './routes/auth.js';
import exchangeRoutes from './routes/exchange.js';
import sampleDataRoutes from './routes/sampleData.js';
import nodeCron from 'node-cron';
import syncDataJson from './syncDataJson.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log image requests
app.use('/uploads', (req, res, next) => {
    console.log(`Serving image: ${req.url}`);
    next();
});

app.use('/', authRoutes);
app.use('/', exchangeRoutes);
app.use('/', sampleDataRoutes);

app.listen(PORT, () => {
    console.log(`🚀 💯 Server is running on port ${PORT}`);
    console.log('❌ 🛑 To kill the server use CTRL+C');
});

// // Schedule the sync task to run every minute
// nodeCron.schedule('* * * * *', () => {
//     console.log('✅ Running syncDataJson every minute');
//     syncDataJson();
// });