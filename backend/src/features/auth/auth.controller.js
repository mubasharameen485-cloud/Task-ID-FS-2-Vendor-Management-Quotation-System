import User from './auth.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// REGISTER LOGIC
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // SECURITY CHECK: Koi bahir se Admin role bhej kar register nahi ho sakta
        if (role === 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Security Alert: You cannot register as an Admin.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ success: false, message: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role: 'USER' // By default har naya banda USER hoga
        });

        res.status(201).json({ 
            success: true, 
            message: 'Registered successfully', 
            data: { id: newUser._id, name, email, role: newUser.role } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// LOGIN LOGIC
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({ 
            success: true, 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};