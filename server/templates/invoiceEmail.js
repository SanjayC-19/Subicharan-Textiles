/**
 * generateInvoiceHTML
 * Produces a premium, brand-consistent HTML email invoice for Subicharan Textiles.
 *
 * @param {object} params
 * @param {string} params.orderId
 * @param {object} params.customer   - { name, email, phone, address, city, state, pincode }
 * @param {Array}  params.items      - [{ name, category, price, quantity, imageURL? }]
 * @param {number} params.subtotal
 * @param {number} params.shipping
 * @param {number} params.tax
 * @param {number} params.total
 * @param {object} params.payment    - { razorpay_payment_id, razorpay_order_id }
 * @param {string} params.orderDate  - ISO date string
 */
export function generateInvoiceHTML({
  orderId,
  customer,
  items = [],
  subtotal,
  shipping,
  tax,
  total,
  payment = {},
  orderDate,
}) {
  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const date = orderDate
    ? new Date(orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #f0ece8;">
          <div style="display:flex;align-items:center;gap:14px;">
            <div>
              <p style="margin:0;font-size:14px;color:#1a1008;font-weight:600;font-family:'Georgia',serif;">${item.name}</p>
              ${item.category ? `<p style="margin:2px 0 0;font-size:11px;color:#9c7c5c;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:0.1em;">${item.category}</p>` : ''}
            </div>
          </div>
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #f0ece8;text-align:center;font-size:14px;color:#5a4a3a;font-family:Arial,sans-serif;">${item.quantity}</td>
        <td style="padding:14px 0;border-bottom:1px solid #f0ece8;text-align:right;font-size:14px;color:#1a1008;font-family:Arial,sans-serif;font-weight:600;">${fmt(item.price * item.quantity)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Invoice – Subitcharan Tex</title>
</head>
<body style="margin:0;padding:0;background-color:#faf7f4;font-family:Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:2px;overflow:hidden;box-shadow:0 4px 24px rgba(90,60,30,0.08);">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#2c1a0e 0%,#4a2e18 100%);padding:40px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-family:'Georgia',serif;font-size:26px;color:#f5ece0;letter-spacing:0.05em;font-weight:normal;">Subitcharan</p>
                    <p style="margin:2px 0 0;font-family:Arial,sans-serif;font-size:10px;color:#c9a87c;letter-spacing:0.3em;text-transform:uppercase;">Tex</p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#c9a87c;letter-spacing:0.2em;text-transform:uppercase;">Invoice</p>
                    <p style="margin:4px 0 0;font-family:'Georgia',serif;font-size:18px;color:#f5ece0;">#${orderId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── SUCCESS BANNER ── -->
          <tr>
            <td style="background:#c9a87c;padding:14px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#2c1a0e;letter-spacing:0.15em;text-transform:uppercase;font-weight:700;">✓ &nbsp;Payment Confirmed</p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#2c1a0e;">${date}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="padding:40px 48px;">

              <!-- Greeting -->
              <p style="margin:0 0 6px;font-family:'Georgia',serif;font-size:22px;color:#1a1008;">Dear ${customer.name},</p>
              <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:14px;color:#7a6a5a;line-height:1.6;">
                Thank you for shopping with us! We have received your order and it is being processed. Below is your invoice summary.
              </p>

              <!-- ── BILLING & SHIPPING ── -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td width="50%" valign="top" style="padding-right:16px;">
                    <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:10px;color:#9c7c5c;letter-spacing:0.25em;text-transform:uppercase;border-bottom:1px solid #f0ece8;padding-bottom:8px;">Billed To</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#1a1008;font-weight:600;">${customer.name}</p>
                    <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#7a6a5a;">${customer.email}</p>
                    <p style="margin:2px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#7a6a5a;">${customer.phone}</p>
                  </td>
                  <td width="50%" valign="top" style="padding-left:16px;">
                    <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:10px;color:#9c7c5c;letter-spacing:0.25em;text-transform:uppercase;border-bottom:1px solid #f0ece8;padding-bottom:8px;">Shipped To</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#7a6a5a;line-height:1.6;">
                      ${customer.address}<br/>
                      ${customer.city}, ${customer.state} – ${customer.pincode}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- ── ORDER ITEMS ── -->
              <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:10px;color:#9c7c5c;letter-spacing:0.25em;text-transform:uppercase;">Order Details</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr style="background:#faf7f4;">
                    <th style="padding:10px 0;text-align:left;font-family:Arial,sans-serif;font-size:11px;color:#9c7c5c;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Item</th>
                    <th style="padding:10px 16px;text-align:center;font-family:Arial,sans-serif;font-size:11px;color:#9c7c5c;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Qty</th>
                    <th style="padding:10px 0;text-align:right;font-family:Arial,sans-serif;font-size:11px;color:#9c7c5c;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <!-- ── TOTALS ── -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#7a6a5a;">Subtotal</td>
                  <td style="padding:6px 0;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#7a6a5a;">${fmt(subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#7a6a5a;">Shipping</td>
                  <td style="padding:6px 0;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#7a6a5a;">${shipping === 0 ? 'Free' : fmt(shipping)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#7a6a5a;">GST (5%)</td>
                  <td style="padding:6px 0;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#7a6a5a;">${fmt(tax)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:12px;border-top:2px solid #2c1a0e;"></td>
                </tr>
                <tr>
                  <td style="padding:10px 0 0;font-family:'Georgia',serif;font-size:18px;color:#1a1008;font-weight:bold;">Total Paid</td>
                  <td style="padding:10px 0 0;text-align:right;font-family:'Georgia',serif;font-size:20px;color:#2c1a0e;font-weight:bold;">${fmt(total)}</td>
                </tr>
              </table>

              <!-- ── PAYMENT INFO ── -->
              ${
                payment.razorpay_payment_id
                  ? `<div style="margin-top:28px;padding:16px 20px;background:#faf7f4;border-left:3px solid #c9a87c;border-radius:2px;">
                      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#9c7c5c;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px;">Payment Reference</p>
                      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#5a4a3a;">Payment ID: <span style="color:#1a1008;font-weight:600;">${payment.razorpay_payment_id}</span></p>
                      ${payment.razorpay_order_id ? `<p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#5a4a3a;">Order ID: <span style="color:#1a1008;font-weight:600;">${payment.razorpay_order_id}</span></p>` : ''}
                    </div>`
                  : ''
              }

              <!-- ── NOTE ── -->
              <p style="margin:32px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#7a6a5a;line-height:1.7;">
                Your order will be dispatched within <strong style="color:#2c1a0e;">2–4 business days</strong>. You will receive a shipping confirmation once it is on its way.
                If you have any questions, please contact us at <a href="mailto:support@subitcharantex.me" style="color:#c9a87c;text-decoration:none;">support@subitcharantex.me</a>.
              </p>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#2c1a0e;padding:28px 48px;text-align:center;">
              <p style="margin:0;font-family:'Georgia',serif;font-size:16px;color:#c9a87c;">Subitcharan Tex</p>
              <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#8a7060;line-height:1.6;">
                Crafted with care · Premier Indian Textiles
              </p>
              <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#6a5a4a;">
                This is an automated invoice. Please retain it for your records.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
