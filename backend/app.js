import dotenv from 'dotenv';
// Load env vars
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Connect to database
connectDB();

// Route files
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/transactions', transactionRoutes);

export default app;