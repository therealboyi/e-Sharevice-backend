// migrations/20240711220648_add_imgHash_to_exchange_items.js
export const up = function (knex) {
    return knex.schema.table('exchange_items', function (table) {
        table.string('imgHash').unique();
    });
};

export const down = function (knex) {
    return knex.schema.table('exchange_items', function (table) {
        table.dropColumn('imgHash');
    });
};