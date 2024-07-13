// controllers/sampleDataController.js
import knex from 'knex';
import dbConfig from '../knexfile.js';

const db = knex(dbConfig);

export const getSampleData = async (req, res) => {
    try {
        const items = await db('exchange_items').select('*');
        res.json(items);
    } catch (error) {
        console.error('Error fetching sample data:', error);
        res.status(500).json({
            error: 'Error fetching sample data'
        });
    }
};