import express from 'express';
const router = express.Router();

// router.post('/create-order', async (req, res) => {
//   try {
//     const { amount, currency = 'INR', receipt } = req.body;
//     const options = {
//       amount: amount * 100, // amount in paise
//       currency,
//       receipt: receipt || `rcpt_${Date.now()}`,
//     };
//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message });
//   }
// });

// File removed: Razorpay backend route code.
export default router;
