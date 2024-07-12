// syncDataJson.js
import knex from 'knex';
import dbConfig from './knexfile.js';
import {
    writeDataFile
} from './fileUtils.js';

const db = knex(dbConfig);

const syncDataJson = async () => {
    try {
        const items = await db('exchange_items').select('*');
        const host = `http://localhost:${process.env.PORT || 8080}`;
        const formattedItems = items.map(item => ({
            provider: item.provider,
            service: item.service,
            imgSrc: `${host}${item.imgSrc}`,
            exchange: item.exchange,
            created_at: item.created_at
        }));
        await writeDataFile(formattedItems);
        console.log('data.json synced successfully');
    } catch (error) {
        console.error('Error syncing data.json:', error);
    }
};

export default syncDataJson;