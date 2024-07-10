// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import knex from 'knex';
import dbConfig from '../knexfile.js';

const db = knex(dbConfig);

export const checkEmail = async (req, res) => {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();
    console.log(`Checking email: ${normalizedEmail}`);

    try {
        const user = await db('users').whereRaw('LOWER(email) = ?', [normalizedEmail]).first();
        if (user) {
            res.status(200).json({ message: 'Email exists' });
        } else {
            res.status(202).json({ message: 'Email not found' });
        }
    } catch (error) {
        console.error('Error checking email:', error.message);
        res.status(500).json({ error: 'Error checking email', details: error.message });
    }
};

export const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (!first_name || !last_name || !normalizedEmail || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await db('users').whereRaw('LOWER(email) = ?', [normalizedEmail]).first();
        if (existingUser) {
            console.log(`Email already in use: ${normalizedEmail}`);
            return res.status(409).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db('users').insert({
            first_name,
            last_name,
            email: normalizedEmail,
            password: hashedPassword
        });
        console.log(`User registered successfully: ${newUser}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Duplicate entry error:', error.message);
            res.status(409).json({ error: 'Email already in use' });
        } else {
            console.error('Error registering user:', error.message);
            res.status(500).json({ error: 'Error registering user', details: error.message });
        }
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (!normalizedEmail || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await db('users').whereRaw('LOWER(email) = ?', [normalizedEmail]).first();
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
