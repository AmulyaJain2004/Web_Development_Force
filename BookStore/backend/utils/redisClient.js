// redisClient.js

import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Redis connection error:', error);
        setTimeout(connectRedis, 5000); // Retry after 5 seconds
    }
}

connectRedis();

redisClient.on('error', (err) => {
    console.log('Redis error:', err);
});

// Export redisClient as default
export default redisClient;
