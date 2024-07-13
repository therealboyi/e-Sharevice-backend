// migrations/20240713050145_create_db_tables.js
export const up = function (knex) {
    return knex.schema
      .createTable('users', function (table) {
        table.increments('id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').notNullable().unique().collate('utf8mb4_unicode_ci');
        table.string('password').notNullable();
        table.timestamps(true, true);
      })
      .then(() => knex.raw('ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'))
      .then(() => {
        return knex.schema.createTable('exchange_items', function (table) {
          table.increments('id').primary();
          table.string('provider').notNullable();
          table.string('service').notNullable();
          table.string('date').notNullable();
          table.string('exchange').notNullable();
          table.string('imgSrc').notNullable();
          table.text('description').notNullable();
          table.string('imgHash').unique();
          table.string('rateType');
          table.timestamps(true, true);
          table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        });
      });
  };
  
  export const down = function (knex) {
    return knex.schema
      .dropTableIfExists('exchange_items')
      .then(() => knex.schema.dropTableIfExists('users'));
  };