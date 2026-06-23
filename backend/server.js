import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import { setupAdminAccount } from './src/config/seedAdmin.js'; // Admin setup function

// Routes Imports
import vendorRoutes from './src/features/vendor/vendor.routes.js';
import quotationRoutes from './src/features/quotation/quotation.routes.js';
import dashboardRoutes from './src/features/dashboard/dashboard.routes.js';
import authRoutes from './src/features/auth/auth.routes.js'; // Naya Auth route

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// DB Connection aur Admin Setup (Sath sath)
connectDB().then(() => {
    setupAdminAccount(); // Server start hotay hi check karega Admin hai ya nahi
});

// APIs Registration
app.use('/api/vendors', vendorRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Vendor Management API is running...');
});

// Server Listening
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});