// migrations/20240711202336_create_exchanges_table.js
export const up = function(knex) {
    return knex.schema.createTable('exchange_items', function(table) {
      table.increments('id').primary();
      table.string('provider').notNullable();
      table.string('service').notNullable();
      table.string('date').notNullable();
      table.string('exchange').notNullable();
      table.string('imgSrc').notNullable();
      table.text('description').notNullable();
      table.timestamps(true, true);
    });
  };
  
  export const down = function(knex) {
    return knex.schema.dropTable('exchange_items');
  };
  