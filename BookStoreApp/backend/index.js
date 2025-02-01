import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';

const app = express();

app.get('/', (request, response) => {
    console.log(request)
    response.status(234).send('Welcome to the server!');
});


mongoose
.connect(mongoDBURL)
.then(() => {
    console.log("App connected to the database");
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((error) => {
  console.log(error);
});