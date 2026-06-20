import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import vendorRoutes from './src/features/vendor/vendor.routes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/api/vendors', vendorRoutes);
// DB Connection
connectDB();

// Basic Route
app.get('/', (req, res) => {
    res.send('Vendor Management API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});