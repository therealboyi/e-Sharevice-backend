// migrations/20240709045555_create_users_table.js
export const up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique().collate('utf8mb4_unicode_ci');
    table.string('password').notNullable();
    table.timestamps(true, true);
  }).then(() => knex.raw('ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'));
};

export const down = function (knex) {
  return knex.schema.dropTable('users');
};