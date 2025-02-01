import express from 'express';
import mongoose from 'mongoose';
import { PORT, mongoDBURL } from './config.js';
import booksRoutes from './routes/bookRoute.js';
import userRoutes from './routes/userRoute.js';
import suggestedBookRoute from './routes/suggestedBookRoute.js';
import compression from 'compression';
import cors from 'cors';
import { createClient } from 'redis';  // Updated import for Redis client in v4

const app = express();
app.use(express.json());
app.use(compression());

// Redis Client Configuration (Updated for Redis v4)
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

// Connect to Redis and handle connection errors
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

// Redis error handler
redisClient.on('error', (err) => {
    console.log('Redis error:', err);
});

// Simplified Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Root Route
app.get('/', (req, res) => {
    return res.status(200).send("This is the backend server for my online book store");
});

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-production-site.com']
        : [
            'http://10.6.1.147:5173',
            'http://localhost:5173',
            'http://0.0.0.0',
            'http://172.20.10.6:5173',
            'http://192.168.29.113:5173'
        ],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Routes
app.use('/books', booksRoutes);
app.use('/users', userRoutes);
app.use('/recommendations', suggestedBookRoute);

// MongoDB Connection and Server Start
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB');
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Graceful Shutdown
        process.on('SIGINT', () => {
            console.log('SIGINT signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                mongoose.connection.close(false, () => {
                    console.log('MongoDB connection closed');
                    redisClient.quit().then(() => {
                        console.log('Redis client disconnected');
                        process.exit(0);
                    }).catch(err => {
                        console.error('Redis disconnection error:', err);
                        process.exit(1);
                    });
                });
            });
        });
    })
    .catch((error) => {
        console.log('MongoDB connection error:', error);
    });
