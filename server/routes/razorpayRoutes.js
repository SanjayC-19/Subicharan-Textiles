import express from 'express';
import crypto from 'crypto';
import razorpay from '../lib/razorpay.js';

const router = express.Router();

router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: receipt || 'rcpt_' + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json({...order});
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message });
  }
});

router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'b7kqzd9sDLMt3MO18GIOE1ZJ';

  const generated_signature = crypto
    .createHmac('sha256', key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    res.json({ status: 'success', message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
  }
});

export default router;
