require('dotenv').config();
const express = require('express');
const Redis = require('ioredis');

const app = express();
const PORT = process.env.PORT || 4000;

const redis = new Redis({
    port: 6379, 
    host: "localhost",
    retryStrategy(times) {
        console.log(`Redis reconnect attempt #${times}`);
        return Math.min(times * 50, 2000); 
    },
});

redis.on('connect', () => console.log('🟢 Redis connected successfully.'));
redis.on('error', (err) => console.error('🔴 Redis error:', err));
redis.on('reconnecting', () => console.log('🟠 Redis reconnecting...'));

// Simulated database function
async function getUserFromDB(id) {
    console.log(`Fetching data for user ${id} from DB...`);
    return { id, name: "John Doe", age: 30, email: "john@example.com" };
}

// API Endpoint with Redis caching
app.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const cacheData = await redis.get(`user:${id}`);

        if (cacheData) {
            console.log(`Cache hit for user:${id}`);
            return res.json(JSON.parse(cacheData));
        }

        console.log(`Cache miss for user:${id}, fetching from DB...`);
        const userData = await getUserFromDB(id);

        await redis.setex(`user:${id}`, 3600, JSON.stringify(userData)); // Cache for 1 hour
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Redis Testing
redis.set("user:name", "Alice");
redis.get("user:name", (err, result) => console.log("Redis Test:", result)); // Output: Alice

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log("🔴 Shutting down gracefully...");
    await redis.quit();
    process.exit(0);
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
