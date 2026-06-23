import bcrypt from 'bcrypt';
import User from '../features/auth/auth.model.js';
import dotenv from 'dotenv';
dotenv.config();

export const setupAdminAccount = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.log('⚠️ Admin credentials not found in .env');
            return;
        }

        // Check if admin already exists
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            });
            console.log(' Secure Admin account created automatically from .env');
        } else {
            console.log(' Admin account is ready.');
        }
    } catch (error) {
        console.error('Error setting up Admin:', error.message);
    }
};