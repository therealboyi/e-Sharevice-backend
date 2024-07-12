// seeds/seed_all.js
import bcrypt from 'bcrypt';

export const seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('exchange_items').del();
    await knex('users').del();

    // Inserts users
    await knex('users').insert([{
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            password: await bcrypt.hash('password123', 10)
        },
        {
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            password: await bcrypt.hash('password123', 10)
        },
        {
            first_name: 'Alice',
            last_name: 'Johnson',
            email: 'alice.johnson@example.com',
            password: await bcrypt.hash('password123', 10)
        }
    ]);

    // Fetch the user IDs after insertion
    const users = await knex('users').select('id');

    // Ensure there are users available
    if (users.length === 0) {
        console.error('No users found in the users table.');
        return;
    }

    // Inserts exchange items using the fetched user IDs
    await knex('exchange_items').insert([{
            provider: 'Personal Instructor',
            service: 'Service',
            date: '2024-07-10T02:39:04.587Z',
            exchange: 'Exchange Type: Dumbbell - Jul 11, 2024',
            imgSrc: '/uploads/avatar.png',
            description: 'Get fit with me.',
            user_id: users[0].id
        },
        {
            provider: 'Gardening',
            service: 'Tool',
            date: '2024-07-10T02:39:05.587Z',
            exchange: 'Exchange Type: Cage - Jul 11, 2024',
            imgSrc: '/uploads/avatar.png',
            description: 'I can help you with taking care of your greens.',
            user_id: users[1].id
        },
        {
            provider: 'Buzz Lightyear',
            service: 'Item',
            date: '2024-07-10T02:40:05.587Z',
            exchange: 'Exchange Type: $15 - Jul 11, 2024',
            imgSrc: '/uploads/avatar.png',
            description: 'Old toy.',
            user_id: users[2].id
        }
    ]);
};