// migrations/[timestamp]_create_users_table.js
export const up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.timestamps(true, true);
    });
  };
  
  export const down = function(knex) {
    return knex.schema.dropTable('users');
  };
  