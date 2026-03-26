import express from 'express';
import transporter from '../lib/mailer.js';
import { generateInvoiceHTML } from '../templates/invoiceEmail.js';
import { generateWelcomeHTML } from '../templates/welcomeEmail.js';

const router = express.Router();

/**
 * POST /api/orders/send-invoice
 */
router.post('/orders/send-invoice', async (req, res) => {
  const { orderId, customer, items, subtotal, shipping, tax, total, payment } = req.body;

  if (!customer?.email) return res.status(400).json({ error: 'Customer email is required' });
  if (!orderId)         return res.status(400).json({ error: 'Order ID is required' });

  try {
    const html = generateInvoiceHTML({
      orderId, customer, items: items || [],
      subtotal: subtotal || 0, shipping: shipping || 0,
      tax: tax || 0, total: total || 0,
      payment: payment || {}, orderDate: new Date().toISOString(),
    });

    const info = await transporter.sendMail({
      from: `"Subitcharan Tex" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `Your Invoice #${orderId} – Subitcharan Tex`,
      html,
    });

    console.log(`[Mailer] ✅ Invoice sent to ${customer.email} | ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('[Mailer] ❌ Invoice email failed:', err.message);
    return res.status(500).json({ error: 'Failed to send invoice email', details: err.message });
  }
});

/**
 * POST /api/auth/welcome
 * Body: { name, email }
 * Sends a welcome email to a newly signed-up user.
 */
router.post('/auth/welcome', async (req, res) => {
  const { name, email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!name)  return res.status(400).json({ error: 'Name is required' });

  try {
    const html = generateWelcomeHTML({ name });

    const info = await transporter.sendMail({
      from: `"Subitcharan Tex" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Subitcharan Tex, ${name}! 🎉`,
      html,
    });

    console.log(`[Mailer] ✅ Welcome email sent to ${email} | ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('[Mailer] ❌ Welcome email failed:', err.message);
    return res.status(500).json({ error: 'Failed to send welcome email', details: err.message });
  }
});

export default router;
