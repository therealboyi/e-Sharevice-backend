// controllers/exchangeController.js
import knex from 'knex';
import dbConfig from '../knexfile.js';
import {
    readDataFile,
    writeDataFile,
    appendReservedFile
} from '../fileUtils.js';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();

const db = knex(dbConfig);

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
        console.error('Error fetching exchange items:', error);
        res.status(500).json({
            error: 'Error fetching exchange items'
        });
    }
};

export const getExchangeItemById = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const item = await db('exchange_items').where({
            id
        }).first();

        if (!item) {
            return res.status(404).json({
                error: 'Item not found'
            });
        }

        const host = `${req.protocol}://${req.get('host')}`;
        item.imgSrc = item.imgSrc ? `${host}${item.imgSrc}` : null;

        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching exchange item:', error);
        res.status(500).json({
            error: 'Error fetching exchange item'
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
    const created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    const updated_at = created_at;

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
            created_at,
            updated_at,
            user_id: userId
        });

        const newItem = await db('exchange_items').where({
            id
        }).first();
        const host = `${req.protocol}://${req.get('host')}`;
        newItem.imgSrc = newItem.imgSrc ? `${host}${newItem.imgSrc}` : null;

        const data = await readDataFile();
        data.push({
            id: newItem.id,
            provider,
            service,
            imgSrc: newItem.imgSrc,
            exchange,
            description,
            user_id: userId,
            created_at,
            updated_at
        });

        await writeDataFile(data);

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating exchange item:', error);
        res.status(500).json({
            error: 'Error creating exchange item',
            details: error.message
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
    const updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

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

        await db('exchange_items').where({
            id,
            user_id: userId
        }).update({
            provider,
            service,
            date,
            exchange,
            imgSrc,
            description,
            rateType,
            updated_at
        });

        const updatedItem = await db('exchange_items').where({
            id
        }).first();
        const host = `${req.protocol}://${req.get('host')}`;
        updatedItem.imgSrc = updatedItem.imgSrc ? `${host}${updatedItem.imgSrc}` : null;
        res.status(200).json(updatedItem);

        await syncDataJson();
    } catch (error) {
        console.error('Error updating exchange item:', error);
        res.status(500).json({
            error: 'Error updating exchange item',
            details: error.message
        });
    }
};

export const deleteExchangeItem = async (req, res) => {
    const {
        id
    } = req.params;
    const userId = req.user.id;

    try {
        const itemToDelete = await db('exchange_items').where({
            id,
            user_id: userId
        }).first();

        if (!itemToDelete) {
            return res.status(404).json({
                error: 'Item not found'
            });
        }

        await db('exchange_items').where({
            id,
            user_id: userId
        }).del();

        const data = await readDataFile();
        const updatedData = data.filter(item => item.imgSrc !== `${req.protocol}://${req.get('host')}${itemToDelete.imgSrc}`);
        await writeDataFile(updatedData);

        res.status(200).json({
            message: 'Exchange item deleted successfully'
        });
        await syncDataJson();
    } catch (error) {
        console.error('Error deleting exchange item:', error);
        res.status(500).json({
            error: 'Error deleting exchange item',
            details: error.message
        });
    }
};

export const reserveExchangeItem = async (req, res) => {
    const {
        id
    } = req.params;
    const userId = req.user.id;
    const reserved_at = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        const item = await db('exchange_items').where({
            id
        }).first();
        if (!item) {
            return res.status(404).json({
                error: 'Item not found'
            });
        }

        await db('exchange_items').where({
            id
        }).update({
            reserved: true,
            reserved_by: userId,
            reserved_at,
            updated_at: reserved_at
        });

        const updatedItem = await db('exchange_items').where({
            id
        }).first();

        const data = await readDataFile();
        const updatedData = data.filter(item => item.id !== parseInt(id));
        await writeDataFile(updatedData);

        await appendReservedFile({
            ...updatedItem,
            reserved: true,
            reserved_by: userId,
            reserved_at
        });

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error reserving exchange item:', error);
        res.status(500).json({
            error: 'Error reserving exchange item',
            details: error.message
        });
    }
};

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
            id: item.id,
            provider: item.provider,
            service: item.service,
            imgSrc: `${host}${item.imgSrc}`,
            exchange: item.exchange,
            description: item.description,
            created_at: item.created_at,
            updated_at: item.updated_at,
            user_id: item.user_id,
            reserved: item.reserved,
            reserved_by: item.reserved_by,
            reserved_at: item.reserved_at
        }));
        await writeDataFile(formattedItems);
        console.log('data.json synced successfully');
    } catch (error) {
        console.error('Error syncing data.json:', error);
    }
};