require('dotenv').config();
const express = require('express');
const redis = require('redis');
const { BloomFilter } = require('bloom-filters');

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = redis.createClient({ url: 'redis://redis:6379' });
redisClient.connect();

const bloom = new BloomFilter(100, 4); // 100 elements, 4 hash functions
app.use(express.json());

// 🟢 Get user data (with Redis caching)
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    
    const cachedUser = await redisClient.get(`user:${userId}`);
    if (cachedUser) {
        return res.json({ source: 'cache', data: JSON.parse(cachedUser) });
    }

    const userData = { id: userId, name: `User ${userId}`, email: `user${userId}@example.com` };
    await redisClient.set(`user:${userId}`, JSON.stringify(userData), { EX: 60 });

    res.json({ source: 'database', data: userData });
});

// 🔴 Register user (prevent duplicates using Bloom Filters)
app.post('/register', async (req, res) => {
    const { email } = req.body;

    if (bloom.has(email)) {
        return res.status(400).json({ message: 'User may already exist!' });
    }

    bloom.add(email);
    res.json({ message: 'User registered successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
