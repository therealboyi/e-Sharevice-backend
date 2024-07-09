// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import knex from 'knex';
import dbConfig from '../knexfile.js';

const db = knex(dbConfig);

export const checkEmail = async (req, res) => {
    const { email } = req.body;
    console.log(`Checking email: ${email}`); // Log email being checked
  
    try {
      const user = await db('users').where({ email }).first();
      if (user) {
        res.status(200).json({ message: 'Email exists' });
      } else {
        res.status(202).json({ message: 'Email not found' }); // Email check
      }
    } catch (error) {
      console.error('Error checking email:', error.message);
      res.status(500).json({ error: 'Error checking email', details: error.message });
    }
  };
  

export const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await db('users').where({ email }).first();
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db('users').insert({ first_name, last_name, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await db('users').where({ email }).first();
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};
