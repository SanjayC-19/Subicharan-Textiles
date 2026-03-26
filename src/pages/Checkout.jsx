import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/productService';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const FIELDS = [
  { name: 'firstName', label: 'First Name', half: true, required: true },
  { name: 'lastName', label: 'Last Name', half: true, required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', required: true },
  { name: 'address', label: 'Address', required: true },
  { name: 'city', label: 'City', half: true, required: true },
  { name: 'state', label: 'State', half: true, required: true },
  { name: 'pincode', label: 'PIN Code', half: true, required: true },
];

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });
  // Removed payment state, only Razorpay is used
  const [status, setStatus] = useState('idle');
  const [orderId, setOrderId] = useState('');

  const subtotal = getCartTotal();
  const shipping = subtotal >= 2000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Removed handleSubmit, only RazorpayButton is used for payment

  if (status === 'success') {
    return (
      <main className="pt-24 min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <CheckCircle size={48} strokeWidth={1} className="mx-auto text-secondary mb-6" />
          <h2 className="font-serif text-3xl text-foreground mb-3">Order Placed</h2>
          <p className="font-sans text-sm text-muted-foreground mb-2">Thank you for your purchase.</p>
          <p className="font-sans text-xs text-muted-foreground mb-8">Order ID: <span className="text-foreground">{orderId}</span></p>
          <div className="flex flex-col gap-3">
            <Link to="/" className="bg-primary text-primary-foreground font-sans text-[11px] tracking-[0.15em] uppercase py-4 hover:bg-primary/85 transition-colors">
              Return Home
            </Link>
            <Link to="/products" className="border border-border text-foreground font-sans text-[11px] tracking-[0.12em] uppercase py-4 hover:border-primary hover:text-primary transition-colors">
              Keep Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">Checkout</h1>
        </div>
      </div>

      <form className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-5 gap-14">
        {/* Left: Form fields */}
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
            <div className="mt-4">
              <RazorpayButton
                amount={total}
                onSuccess={response => {
                  setStatus('processing');
                  placeOrder({ items: cartItems, customer: form, payment: 'razorpay', total, razorpay: response })
                    .then(id => {
                      setOrderId(id || `ORD-${Date.now()}`);
                      clearCart();
                      setStatus('success');
                    })
                    .catch(() => setStatus('error'));
                }}
                onError={() => setStatus('error')}
              />
            </div>
          </section>

          {status === 'error' && (
            <p className="font-sans text-sm text-destructive">Something went wrong. Please try again.</p>
          )}
        // Removed RazorpayButton import
        </div>

        {/* Right: Order Summary */}
              {/* RazorpayButton removed */}
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 font-sans text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
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
