// seeds/[timestamp]_sample_users.js
import bcrypt from 'bcrypt';

export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Inserts seed entries
  await knex('users').insert([
    {
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
};
