// seeds/seed_all.js
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import {
    appendDataFile,
    writeDataFile,
    writeReservedFile
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

// Function to clear reserved.json file
const clearReservedFile = async () => {
    await writeReservedFile([]);
};

export const seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('exchange_items').del();
    await knex('users').del();

    // Deletes all files in /uploads except those in /uploads/public
    deleteUploadsExceptPublic();

    // Clears the reserved.json file
    await clearReservedFile();

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
            description: 'Join my personal training sessions and achieve your fitness goals with customized workout plans tailored to your needs and abilities. Whether you are a beginner or an athlete, I am here to help.',
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
            description: 'High-quality yoga mat for your yoga sessions. This mat is designed to provide comfort and stability during your yoga practice. Perfect for beginners and experienced yogis alike.',
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
            description: 'Receive personalized diet plans that are tailored to your unique needs and preferences. Our nutritionist will help you achieve your health goals with expert advice and support.',
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
            description: 'Professional gardening services to help you maintain a beautiful and healthy garden. From planting to pruning, we take care of all your gardening needs with expert care.',
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
            description: 'Expert lawn mowing services to keep your lawn looking neat and well-maintained. We use the latest equipment and techniques to ensure a perfect cut every time.',
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
            description: 'Professional plant care services to keep your plants healthy and thriving. From watering to fertilizing, we provide comprehensive care for all types of plants.',
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
            description: 'Pre-loved Buzz Lightyear toy in excellent condition. A great addition to any Toy Story fan’s collection. Features all the iconic catchphrases and lights up for interactive play.',
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
            description: 'Engaging bedtime Toy Story sessions for your kids. Let their imagination soar with stories of Woody, Buzz, and the gang. Perfect for bedtime or quiet time entertainment.',
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
            description: 'Rare and collectible comic book in pristine condition. A must-have for any comic book enthusiast or collector. Dive into a world of adventure and excitement with this unique find.',
            user_id: users[2].id,
            created_at: moment('2024-07-12T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-12T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Bicycle Repair',
            service: 'Service',
            date: moment('2024-07-13T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $20 - Jul 14, 2024',
            imgSrc: '/uploads/public/messi.png',
            description: 'Professional bicycle repair services to ensure your bike is in top condition. From flat tires to brake adjustments, I offer comprehensive repairs and maintenance.',
            user_id: users[0].id,
            created_at: moment('2024-07-13T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-13T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Painting Lessons',
            service: 'Service',
            date: moment('2024-07-13T02:40:06.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Art Supplies - Jul 14, 2024',
            imgSrc: '/uploads/public/messi.png',
            description: 'Learn the art of painting with professional lessons. Whether you are a beginner or looking to refine your skills, I provide personalized instruction to help you create beautiful artworks.',
            user_id: users[1].id,
            created_at: moment('2024-07-13T02:40:06.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-13T02:40:06.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Pet Sitting',
            service: 'Service',
            date: moment('2024-07-13T02:40:07.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $15/day - Jul 14, 2024',
            imgSrc: '/uploads/public/ronaldo.png',
            description: 'Reliable and caring pet sitting services for your furry friends. I provide daily walks, feeding, and companionship to ensure your pets are happy and well-taken care of while you are away.',
            user_id: users[2].id,
            created_at: moment('2024-07-13T02:40:07.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-13T02:40:07.587Z').format('YYYY-MM-DD HH:mm:ss')
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
        reserved: item.reserved,
        reserved_by: item.reserved_by,
        reserved_at: item.reserved_at,
        created_at: item.created_at,
        updated_at: item.updated_at
    }));

    // Writes the initial data to data.json
    await writeDataFile(exchangeItemsForJson);

    console.log('Seed data inserted and written to data.json successfully.');
};
