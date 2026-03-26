import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { saveOrder } from '../services/orderService';
import { useNavigate, Link } from 'react-router-dom';

import { CheckCircle, Mail } from 'lucide-react';
import RazorpayButton from '../components/RazorpayButton';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/** Generates a random order ID like ORD-A3F7K2P9 */
const generateOrderId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/1/I to avoid confusion
  let suffix = '';
  for (let i = 0; i < 8; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return 'ORD-' + suffix;
};

const FIELDS = [
  { name: 'firstName', label: 'First Name', half: true, required: true },
  { name: 'lastName',  label: 'Last Name',  half: true, required: true },
  { name: 'email',     label: 'Email',  type: 'email', required: true },
  { name: 'phone',     label: 'Phone',  type: 'tel',   required: true },
  { name: 'address',   label: 'Address', required: true },
  { name: 'city',      label: 'City',  half: true, required: true },
  { name: 'state',     label: 'State', half: true, required: true },
  { name: 'pincode',   label: 'PIN Code', half: true, required: true },
];

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('authUser'));

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
  });
  const [status, setStatus]   = useState('idle');   // idle | processing | success | error
  const [orderId, setOrderId] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal >= 2000 ? 0 : 150;
  const tax      = Math.round(subtotal * 0.05);
  const total    = subtotal + shipping + tax;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const isFormValid  = () => FIELDS.every(f => form[f.name].trim() !== '');

  /** Called after Razorpay payment is verified successfully */
  const handlePaymentSuccess = async (razorpayResponse) => {
    setStatus('processing');

    // Always use our own random order ID (clean, readable)
    const finalId = generateOrderId();
    setOrderId(finalId);

    // 2. Send invoice email (Nodemailer + Gmail)
    try {
      const emailRes = await fetch(`${API_BASE}/orders/send-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: finalId,
          customer: {
            name:    form.firstName + ' ' + form.lastName,
            email:   form.email,
            phone:   form.phone,
            address: form.address,
            city:    form.city,
            state:   form.state,
            pincode: form.pincode,
          },
          items: cartItems.map(item => ({
            name:     item.name,
            category: item.category,
            price:    item.price,
            quantity: item.quantity,
            imageURL: item.imageURL || item.image,
          })),
          subtotal,
          shipping,
          tax,
          total,
          payment: {
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_order_id:   razorpayResponse.razorpay_order_id,
          },
        }),
      });
      const emailData = await emailRes.json();
      setEmailSent(emailData.success === true);
    } catch (err) {
      console.warn('Invoice email failed (non-critical):', err);
      setEmailSent(false);
    }

    // 3. Save order to Firestore
    try {
      await saveOrder({
        orderId: finalId,
        userId: user?.uid || 'guest',
        customer: {
          name:    form.firstName + ' ' + form.lastName,
          email:   form.email,
          phone:   form.phone,
          address: form.address,
          city:    form.city,
          state:   form.state,
          pincode: form.pincode,
        },
        items: cartItems.map(item => ({
          name:     item.name,
          category: item.category,
          price:    item.price,
          quantity: item.quantity,
          imageURL: item.imageURL || item.image,
        })),
        subtotal,
        shipping,
        tax,
        total,
        payment: {
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id:   razorpayResponse.razorpay_order_id,
        },
      });
    } catch (err) {
      console.error('Failed to save order to DB:', err);
      // We still proceed since payment was successful and email might have sent
    }

    clearCart();
    setStatus('success');
    // Short delay to show the success state before redirecting
    setTimeout(() => {
      navigate(`/order-confirmation?id=${finalId}`);
    }, 1500);
  };


  // ── Success screen ──────────────────────────────────────
  if (status === 'success') {
    return (
      <main className="pt-24 min-h-screen bg-emerald-50/20 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="font-serif text-2xl text-emerald-900 mb-2 tracking-tight">Payment Verified</h2>
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-emerald-600/60 animate-pulse font-bold">Curating your confirmation experience...</p>
      </main>
    );
  }

  // ── Checkout form ───────────────────────────────────────
  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">Checkout</h1>
        </div>
      </div>

      <form className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-5 gap-14">

        {/* ── Left: Form ── */}
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-secondary mb-6">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {FIELDS.map(f => (
                <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
                  <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-foreground block mb-1.5">
                    {f.label}{f.required && ' *'}
                  </label>
                  <input
                    name={f.name}
                    type={f.type || 'text'}
                    required={f.required}
                    value={form[f.name]}
                    onChange={handleChange}
                    className="w-full bg-background border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-secondary mb-6">Payment</h2>
            <div className="mt-4 space-y-3">
              {/* Email hint */}
              {isFormValid() && (
                <p className="font-sans text-xs text-muted-foreground flex items-center gap-1.5">
                  <Mail size={12} />
                  Invoice will be emailed to <span className="text-foreground">{form.email}</span>
                </p>
              )}

              {!isFormValid() ? (
                <div className="text-sm font-sans text-muted-foreground border border-border p-4">
                  Please fill all shipping details to proceed.
                </div>
              ) : (
                <RazorpayButton
                  amount={total}
                  customer={{
                    name:  form.firstName + ' ' + form.lastName,
                    email: form.email,
                    phone: form.phone,
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={() => setStatus('error')}
                />
              )}
            </div>
          </section>

          {status === 'processing' && (
            <p className="font-sans text-sm text-muted-foreground animate-pulse">Confirming your order…</p>
          )}
          {status === 'error' && (
            <p className="font-sans text-sm text-destructive">Something went wrong. Please try again.</p>
          )}
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="lg:col-span-2">
          <div className="bg-background border border-border p-6">
            <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-secondary mb-6">Order Summary</h2>
            <div className="space-y-4 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.imageURL || item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover object-center"
                  />
                  <div className="flex-1">
                    <h3 className="font-sans text-sm text-foreground">{item.name}</h3>
                    <p className="font-sans text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-sans text-sm text-foreground">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2 font-sans text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? 'Free' : ('₹' + shipping)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>GST (5%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between font-semibold text-foreground text-base border-t border-border pt-3 mt-3">
                <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

      </form>
    </main>
  );
}
