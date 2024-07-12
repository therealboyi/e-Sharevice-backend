// seeds/sample_exchange_items.js
export const seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('exchange_items').del();

    // Inserts seed entries
    await knex('exchange_items').insert([{
        provider: 'Fit4Less',
        service: 'Service',
        date: '2024-07-10',
        exchange: 'Exchange Type: $15 - Jul 11, 2024',
        imgSrc: '/uploads/avatar.png',
        description: 'Personal training services.'
    }]);
};