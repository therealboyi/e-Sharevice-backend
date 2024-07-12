// routes/sampleData.js
import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/sample-data', (req, res) => {
    const dataPath = path.join(process.cwd(), 'data.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Error reading data file'
            });
        }
        res.status(200).json(JSON.parse(data));
    });
});

export default router;