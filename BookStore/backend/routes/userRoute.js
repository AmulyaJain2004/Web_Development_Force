import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Route to create a new user 
router.post('/register', async (req, res) => {
    const { password, email, adminCode } = req.body;

    if (!email || !password || !adminCode) {
        console.log('Missing fields in request body:', req.body);
        return res.status(400).json({ message: 'Email, password, and admin code are required' });
    }

    if (adminCode != 8888) {
        console.log('Wrong Admin Code');
        return res.status(400).json({ message: 'Wrong Admin Code' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`User already exists with email: ${email}`);
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });

        const newUser = await user.save();
        console.log(newUser);
        console.log(`User Created Email:${newUser.email}`);
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Route to log in a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        console.log('Missing fields in request body:', req.body);
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found with email: ${email}`);
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Incorrect password for user: ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log(`${user.email} login successful`)
        if (user.email === 'admin@gmail.com') { return res.status(200).json({ message: 'Admin login successful', isAdmin: true }); }
        return res.status(200).json({ message: 'Login successful', isAdmin: false });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Route to reset password
router.post('/forgotPassword', async (req, res) => {
    const { email, newPassword, adminCode } = req.body;

    // Validate inputs
    if (!email || !newPassword || !adminCode) {
        console.log('Missing fields in request body:', req.body);
        return res.status(400).json({ message: 'Email, new password, and admin code are required' });
    }

    if (adminCode != 8888) {
        console.log('Wrong Admin Code');
        return res.status(400).json({ message: 'Wrong Admin Code' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found with email: ${email}`);
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();
        console.log('Password updated for user', user.email);
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

export default router;
