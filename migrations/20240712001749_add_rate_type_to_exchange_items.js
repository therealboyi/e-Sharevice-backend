// migrations/20240712001749_add_rate_type_to_exchange_items.js
export function up(knex) {
    return knex.schema.table('exchange_items', (table) => {
        table.string('rateType');
    });
}

export function down(knex) {
    return knex.schema.table('exchange_items', (table) => {
        table.dropColumn('rateType');
    });
}