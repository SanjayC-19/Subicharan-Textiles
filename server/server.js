import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import razorpayRoutes from './routes/razorpayRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = !origin || /^http:\/\/localhost:\d+$/.test(origin);
      callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
    },
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'subicharan-tex-api' });
});


console.log('Registering auth routes at /api/auth');
app.use('/api/auth', authRoutes);
app.use('/api', materialRoutes);
app.use('/api', orderRoutes);
app.use('/api', userRoutes);
app.use('/api/razorpay', razorpayRoutes);

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in .env');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing in .env');
    }

    // MongoDB connection removed

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Server start failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
