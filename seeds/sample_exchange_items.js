// seeds/sample_exchange_items.js
export const seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('exchange_items').del();

    // Inserts seed entries
    await knex('exchange_items').insert([{
            provider: 'Fit4Less',
            service: 'Personal Trainer',
            date: 'Mar. 19, 2023',
            exchange: 'Vancouver, Canada',
            imgSrc: '/uploads/avatar.png',
            description: 'Personal training services.'
        },
        {
            provider: 'Mandy\'s Pawradise',
            service: 'Dog Walker',
            date: 'Jun. 07, 2023',
            exchange: 'Burnaby, Canada',
            imgSrc: '/uploads/avatar.png',
            description: 'Dog walking services.'
        }
    ]);
};