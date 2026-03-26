import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load server/.env explicitly before other imports
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

import cors from 'cors';
import express from 'express';
import razorpayRoutes from './routes/razorpayRoutes.js';

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

// ── Routes ──────────────────────────────────────────────
app.use('/api/razorpay', razorpayRoutes);

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
      console.log(`   Razorpay Key: ${process.env.RAZORPAY_KEY_ID ? '✓ loaded' : '✗ MISSING — check server/.env'}`);
    });
  } catch (error) {
    console.error('Server start failed: ' + error.message);
    process.exit(1);
  }
};

startServer();
