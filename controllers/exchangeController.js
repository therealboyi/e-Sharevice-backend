// controllers/exchangeController.js
import knex from 'knex';
import dbConfig from '../knexfile.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const db = knex(dbConfig);

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const getHash = (fileBuffer) => {
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
};

export const getAllExchangeItems = async (req, res) => {
    try {
        const items = await db('exchange_items').select('*');
        const host = `${req.protocol}://${req.get('host')}`;
        const itemsWithFullUrls = items.map(item => ({
            ...item,
            imgSrc: item.imgSrc ? `${host}${item.imgSrc}` : null
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
        description
    } = req.body;
    const image = req.file;

    try {
        let imgSrc = null;
        if (image) {
            const fileBuffer = fs.readFileSync(image.path);
            const hash = getHash(fileBuffer);
            const existingImage = fs.readdirSync(UPLOADS_DIR).find(file => file.startsWith(hash));

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
            description
        });

        const newItem = await db('exchange_items').where({
            id
        }).first();
        const host = `${req.protocol}://${req.get('host')}`;
        newItem.imgSrc = newItem.imgSrc ? `${host}${newItem.imgSrc}` : null;
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
        description
    } = req.body;
    const image = req.file;

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
            const existingImage = fs.readdirSync(UPLOADS_DIR).find(file => file.startsWith(hash));

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

        const updatedItem = await db('exchange_items')
            .where({
                id
            })
            .update({
                provider,
                service,
                date,
                exchange,
                imgSrc,
                description
            })
            .returning('*');
        const host = `${req.protocol}://${req.get('host')}`;
        updatedItem[0].imgSrc = updatedItem[0].imgSrc ? `${host}${updatedItem[0].imgSrc}` : null;
        res.status(200).json(updatedItem[0]);
    } catch (error) {
        res.status(500).json({
            error: 'Error updating exchange item'
        });
    }
};

export const deleteExchangeItem = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        await db('exchange_items')
            .where({
                id
            })
            .del();
        res.status(200).json({
            message: 'Exchange item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error deleting exchange item'
        });
    }
};