import express from 'express';
import transporter from '../lib/mailer.js';
import { generateInvoiceHTML } from '../templates/invoiceEmail.js';
import { generateWelcomeHTML } from '../templates/welcomeEmail.js';

const router = express.Router();
const ADMIN_EMAILS = ['sanjayc.23aim@kongu.edu', 'sanjaycs1902@gmail.com'];

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

/**
 * POST /api/alerts/low-stock
 * Body: { materialCode, yarnType, color, stock }
 * Sends a low stock alert to the admin email.
 */
router.post('/alerts/low-stock', async (req, res) => {
  const { materialCode, yarnType, color, stock } = req.body;

  try {
    const html = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #fef2f2; padding: 20px; text-align: center; border-bottom: 1px solid #fecaca;">
          <h2 style="color: #991b1b; margin: 0; font-size: 24px;">🚨 Critical Inventory Alert</h2>
          <p style="color: #b91c1c; margin-top: 5px; font-weight: 500;">Action Required: Low Stock Detected</p>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">
            The following premium material has fallen below the critical threshold of <strong>500 meters</strong>:
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold; width: 40%;">Material Code:</td>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: bold;">${materialCode || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Yarn Type:</td>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${yarnType || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Color Profile:</td>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${color || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; color: #64748b; font-weight: bold;">Current Stock:</td>
              <td style="padding: 12px; color: #dc2626; font-size: 20px; font-weight: 900;">${stock} m</td>
            </tr>
          </table>

          <p style="font-size: 14px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 20px;">
            This is an automated system notification from your Subicharan Textiles inventory monitor. Please arrange for a restock to avoid order delays.
          </p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Subicharan System Alerts" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAILS,
      subject: `URGENT: Low Stock (${stock}m left) - ${materialCode}`,
      html,
    });

    console.log(`[Mailer] ⚠️ Low stock alert sent to Admin | ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('[Mailer] ❌ Low stock alert failed:', err.message);
    return res.status(500).json({ error: 'Failed to send alert', details: err.message });
  }
});

export default router;
