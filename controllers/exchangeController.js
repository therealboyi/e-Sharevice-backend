// controllers/exchangeController.js
import knex from 'knex';
import dbConfig from '../knexfile.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
    readDataFile,
    writeDataFile
} from '../fileUtils.js';
import dotenv from 'dotenv';

const db = knex(dbConfig);

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const getHash = (fileBuffer) => {
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
};

const syncDataJson = async () => {
    try {
        const items = await db('exchange_items').select('*');
        const host = `http://localhost:${process.env.PORT || 8080}`;
        const formattedItems = items.map(item => ({
            provider: item.provider,
            service: item.service,
            imgSrc: `${host}${item.imgSrc}`,
            exchange: item.exchange
        }));
        await writeDataFile(formattedItems);
        console.log('data.json synced successfully');
    } catch (error) {
        console.error('Error syncing data.json:', error);
    }
};

export const getAllExchangeItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await db('exchange_items').where({
            user_id: userId
        }).select('*');
        const host = `${req.protocol}://${req.get('host')}`;
        const itemsWithFullUrls = items.map((item) => ({
            ...item,
            imgSrc: item.imgSrc ? `${host}${item.imgSrc}` : null,
        }));
        res.status(200).json(itemsWithFullUrls);
    } catch (error) {
        res.status(500).json({
            error: 'Error fetching exchange items'
        });
    }
};

export const createExchangeItem = async (req, res) => {
    const {
        provider,
        service,
        date,
        exchange,
        description,
        rateType
    } = req.body;
    const image = req.file;
    const userId = req.user.id;

    try {
        let imgSrc = '/uploads/public/noimage.png';
        if (image) {
            const fileBuffer = fs.readFileSync(image.path);
            const hash = getHash(fileBuffer);
            const existingImage = fs.readdirSync(UPLOADS_DIR).find((file) => file.startsWith(hash));

            if (existingImage) {
                imgSrc = `/uploads/${existingImage}`;
                fs.unlinkSync(image.path);
            } else {
                const extension = path.extname(image.originalname);
                const filename = `${hash}${extension}`;
                const newFilePath = path.join(UPLOADS_DIR, filename);
                fs.renameSync(image.path, newFilePath);
                imgSrc = `/uploads/${filename}`;
            }
        }

        const [id] = await db('exchange_items').insert({
            provider,
            service,
            date,
            exchange,
            imgSrc,
            description,
            rateType,
            user_id: userId,
        });

        const newItem = await db('exchange_items').where({
            id
        }).first();
        const host = `${req.protocol}://${req.get('host')}`;
        newItem.imgSrc = newItem.imgSrc ? `${host}${newItem.imgSrc}` : null;

        // Read current data from data.json
        const data = await readDataFile();

        // Append the new item to the data
        data.push({
            provider,
            service,
            imgSrc: newItem.imgSrc,
            exchange,
        });

        // Write the updated data back to data.json
        await writeDataFile(data);

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating exchange item:', error);
        res.status(500).json({
            error: 'Error creating exchange item'
        });
    }
};

export const updateExchangeItem = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        provider,
        service,
        date,
        exchange,
        description,
        rateType
    } = req.body;
    const image = req.file;
    const userId = req.user.id;

    if (!provider || !service || !date || !exchange || !description) {
        return res.status(400).json({
            error: 'All fields are required'
        });
    }

    try {
        let imgSrc = req.body.imgSrc;
        if (image) {
            const fileBuffer = fs.readFileSync(image.path);
            const hash = getHash(fileBuffer);
            const existingImage = fs.readdirSync(UPLOADS_DIR).find((file) => file.startsWith(hash));

            if (existingImage) {
                imgSrc = `/uploads/${existingImage}`;
                fs.unlinkSync(image.path);
            } else {
                const extension = path.extname(image.originalname);
                const filename = `${hash}${extension}`;
                const newFilePath = path.join(UPLOADS_DIR, filename);
                fs.renameSync(image.path, newFilePath);
                imgSrc = `/uploads/${filename}`;
            }
        }

        await db('exchange_items')
            .where({
                id,
                user_id: userId
            })
            .update({
                provider,
                service,
                date,
                exchange,
                imgSrc,
                description,
                rateType
            });

        const updatedItem = await db('exchange_items').where({
            id
        }).first();
        const host = `${req.protocol}://${req.get('host')}`;
        updatedItem.imgSrc = updatedItem.imgSrc ? `${host}${updatedItem.imgSrc}` : null;
        res.status(200).json(updatedItem);

        await syncDataJson(); // Sync the JSON file
    } catch (error) {
        console.error('Error updating exchange item:', error);
        res.status(500).json({
            error: 'Error updating exchange item'
        });
    }
};

export const deleteExchangeItem = async (req, res) => {
    const {
        id
    } = req.params;
    const userId = req.user.id;

    try {
        const itemToDelete = await db('exchange_items')
            .where({
                id,
                user_id: userId
            })
            .first();

        if (!itemToDelete) {
            return res.status(404).json({
                error: 'Item not found'
            });
        }

        await db('exchange_items')
            .where({
                id,
                user_id: userId
            })
            .del();

        // Read current data from data.json
        const data = await readDataFile();

        // Filter out the item to be deleted
        const updatedData = data.filter(item => item.imgSrc !== `${req.protocol}://${req.get('host')}${itemToDelete.imgSrc}`);

        // Write the updated data back to data.json
        await writeDataFile(updatedData);

        res.status(200).json({
            message: 'Exchange item deleted successfully'
        });

        await syncDataJson(); // Sync the JSON file
    } catch (error) {
        console.error('Error deleting exchange item:', error);
        res.status(500).json({
            error: 'Error deleting exchange item'
        });
    }
};