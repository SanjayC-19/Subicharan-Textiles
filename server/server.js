import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load server/.env before all other imports
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

import cors from 'cors';
import express from 'express';
import razorpayRoutes from './routes/razorpayRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import './lib/mailer.js'; // initialises & verifies Gmail SMTP on startup

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'subicharan-tex-api' });
});

// ── Routes ───────────────────────────────────────────────
app.use('/api/razorpay', razorpayRoutes);
app.use('/api', emailRoutes);

// ── Production Frontend Serving ──────────────────────────────
// Serve static files from the "dist" folder (created by vite build)
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Handle React Router SPA: serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return; // let 404s for API stay as 404s
  res.sendFile(path.join(distPath, 'index.html'));
});

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
      console.log(`   Razorpay Key : ${process.env.RAZORPAY_KEY_ID ? '✓ loaded' : '✗ MISSING'}`);
      console.log(`   Gmail sender : ${process.env.EMAIL_USER     ? '✓ ' + process.env.EMAIL_USER : '✗ MISSING'}`);
    });
  } catch (error) {
    console.error('Server start failed:', error.message);
    process.exit(1);
  }
};

startServer();
