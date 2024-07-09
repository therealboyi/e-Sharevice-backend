// index.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConfig from './knexfile.js';
import {
    authenticateToken
} from './authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 8080;

const db = knex(dbConfig);

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('Server Running Successfully 🚀 💯');
});

app.post('/signup', async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        password
    } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
            error: 'All fields are required'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db('users').insert({
            first_name,
            last_name,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error creating user'
        });
    }
});

app.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        });
    }

    try {
        const user = await db('users').where({
            email
        }).first();
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({
                id: user.id,
                email: user.email
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            res.status(200).json({
                message: 'Login successful',
                token
            });
        } else {
            res.status(401).json({
                error: 'Invalid email or password'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Error logging in'
        });
    }
});

app.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'This is a protected route',
        user: req.user
    });
});

app.listen(PORT, () => {
    console.log(`🚀 💯 Server is running on port ${PORT}`);
    console.log('❌ 🛑 To kill the server use CTRL+C');
});