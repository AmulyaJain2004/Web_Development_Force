import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// Middleware to handle CORS
app.use(
    cors({ 
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware to parse JSON requests
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/reports", reportRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});