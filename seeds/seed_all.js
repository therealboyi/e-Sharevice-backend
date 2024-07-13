// seeds/seed_all.js 
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import {
    appendDataFile,
    writeDataFile
} from '../fileUtils.js';
import dotenv from 'dotenv';

dotenv.config();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const PUBLIC_DIR = path.join(UPLOADS_DIR, 'public');

// Function to delete all files in /uploads except those in /uploads/public
const deleteUploadsExceptPublic = () => {
    fs.readdirSync(UPLOADS_DIR).forEach(file => {
        const filePath = path.join(UPLOADS_DIR, file);
        if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR)) {
            if (fs.statSync(filePath).isDirectory()) {
                fs.rmdirSync(filePath, {
                    recursive: true
                });
            } else {
                fs.unlinkSync(filePath);
            }
        }
    });
};

export const seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('exchange_items').del();
    await knex('users').del();

    // Deletes all files in /uploads except those in /uploads/public
    deleteUploadsExceptPublic();

    // Inserts users
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    await knex('users').insert([{
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            password: await bcrypt.hash('password123', 10),
            created_at: now,
            updated_at: now
        },
        {
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            password: await bcrypt.hash('password123', 10),
            created_at: now,
            updated_at: now
        },
        {
            first_name: 'Alice',
            last_name: 'Johnson',
            email: 'alice.johnson@example.com',
            password: await bcrypt.hash('password123', 10),
            created_at: now,
            updated_at: now
        }
    ]);

    // Fetch the user IDs after insertion
    const users = await knex('users').select('id');

    // Ensures there are users available
    if (users.length === 0) {
        console.error('No users found in the users table.');
        return;
    }

    // Inserts exchange items using the fetched user IDs
    const exchangeItems = [{
            provider: 'Personal Instructor',
            service: 'Service',
            date: moment('2024-07-10T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Dumbbells - Jul 11, 2024',
            imgSrc: '/uploads/public/messi.png',
            description: 'Get fit with me.',
            user_id: users[0].id,
            created_at: moment('2024-07-10T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-10T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Yoga Mat',
            service: 'Item',
            date: moment('2024-07-11T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Yoga Instructions - Jul 12, 2024',
            imgSrc: '/uploads/public/ronaldo.png',
            description: 'FreeYoga classes.',
            user_id: users[0].id,
            created_at: moment('2024-07-11T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-11T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Nutritionist',
            service: 'Service',
            date: moment('2024-07-12T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Unused Food Containers - Jul 13, 2024',
            imgSrc: '/uploads/public/lebron.png',
            description: 'Personalized diet plans.',
            user_id: users[0].id,
            created_at: moment('2024-07-12T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-12T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Gardening',
            service: 'Service',
            date: moment('2024-07-10T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Power Drill - Jul 11, 2024',
            imgSrc: '/uploads/public/mbappe.png',
            description: 'I can help you with taking care of your greens.',
            user_id: users[1].id,
            created_at: moment('2024-07-10T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-10T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Lawn Mowing',
            service: 'Service',
            date: moment('2024-07-11T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $500 - Jul 12, 2024',
            imgSrc: '/uploads/public/giannis.png',
            description: 'Lawn mower.',
            user_id: users[1].id,
            created_at: moment('2024-07-11T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-11T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Plant Care',
            service: 'Service',
            date: moment('2024-07-12T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Watering Can - Jul 13, 2024',
            imgSrc: '/uploads/public/curry.png',
            description: 'Plant care and watering services.',
            user_id: users[1].id,
            created_at: moment('2024-07-12T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-12T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Buzz Lightyear',
            service: 'Item',
            date: moment('2024-07-10T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $15 - Jul 11, 2024',
            imgSrc: '/uploads/public/durant.png',
            description: 'Used toy in good condition.',
            user_id: users[2].id,
            created_at: moment('2024-07-10T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-10T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Toy Story',
            service: 'Service',
            date: moment('2024-07-11T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $10/hr - Jul 12, 2024',
            imgSrc: '/uploads/public/neymar.png',
            description: 'Bedtime Toy Story for your kids.',
            user_id: users[2].id,
            created_at: moment('2024-07-11T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-11T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Comic Book',
            service: 'Item',
            date: moment('2024-07-12T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $5 - Jul 13, 2024',
            imgSrc: '/uploads/public/debryune.png',
            description: 'Rare comic book.',
            user_id: users[2].id,
            created_at: moment('2024-07-12T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-12T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        }
    ];

    await knex('exchange_items').insert(exchangeItems);

    // Fetch the inserted items
    const insertedItems = await knex('exchange_items').select('*');

    // Converts exchangeItems to the desired format for the JSON file
    const exchangeItemsForJson = insertedItems.map(item => ({
        id: item.id, // Include ID
        provider: item.provider,
        service: item.service,
        imgSrc: `http://localhost:${process.env.PORT || 8080}${item.imgSrc}`,
        exchange: item.exchange,
        description: item.description,
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at
    }));

    // Writes the initial data to data.json
    await writeDataFile(exchangeItemsForJson);

    console.log('Seed data inserted and written to data.json successfully.');
};