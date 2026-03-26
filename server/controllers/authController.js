import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendMail } from '../../backend/mailer.js';

export const signup = async (req, res) => {
  try {
    const { name, email, address, role } = req.body;
    if (!name || !email || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists in MongoDB
    let user = await User.findOne({ email });
    if (!user) {
      // Create user in MongoDB
      user = await User.create({
        name,
        email,
        address,
        role: role || 'user',
        authProvider: 'local'
      });
    }

    // Send welcome email
    try {
      await sendMail({
        to: user.email,
        subject: 'Welcome to Subicharan Textiles!',
        text: `Hi ${user.name},\n\nThank you for signing up at Subicharan Textiles!`,
        html: `<p>Hi ${user.name},</p><p>Thank you for signing up at Subicharan Textiles!</p>`
      });
    } catch (mailErr) {
      console.error('Failed to send welcome email:', mailErr.message);
    }

    return res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ message: 'Failed to create account' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user in MongoDB to get real name and address
    let user = await User.findOne({ email });

    // If not found in DB (e.g. legacy Firebase-only user), use placeholder info
    if (!user) {
      console.warn(`User with email ${email} not found in MongoDB. Using placeholder data.`);
      user = { name: 'Firebase User', email, role: 'user', _id: 'firebase-uid' };
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send personalized welcome back email on login
    try {
      await sendMail({
        to: user.email,
        subject: 'Welcome back to Subicharan Textiles!',
        text: `Hi ${user.name},\n\nWelcome back to Subicharan Textiles! We are glad to see you again.`,
        html: `<p>Hi ${user.name},</p><p>Welcome back to <b>Subicharan Textiles</b>! We are glad to see you again.</p>`
      });
    } catch (mailErr) {
      console.error('Failed to send login welcome email:', mailErr.message);
    }

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Failed to login' });
  }
};
