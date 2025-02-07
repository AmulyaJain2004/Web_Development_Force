import express, { request, response } from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import booksRouter from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

// Middleware for parsing JSON data
app.use(express.json());

// Middleware for handling CORS policy
// Option 1: Allow all origins
app.use(cors());
// Option 2: Allow custom origins
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
// }));


app.get('/', (request, response) => {
    response.status(234).send('Hello World!');
});

app.use('/books', booksRouter)

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB: ', error);
    });