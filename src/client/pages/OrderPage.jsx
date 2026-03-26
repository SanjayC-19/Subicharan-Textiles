import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, sendInvoiceEmail } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { auth } from '../../config/Firebase';
import { ShoppingBag, Loader2 } from 'lucide-react';
import RazorpayButton from '../../components/RazorpayButton';

export default function OrderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    deliveryAddress: user?.address || '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const resolveCustomerEmail = () => {
    if (user?.email) return user.email;
    if (auth.currentUser?.email) return auth.currentUser.email;
    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.email || '';
    } catch {
      return '';
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05;
  const shipping = subtotal > 5000 ? 0 : 250;
  const grandTotal = subtotal + tax + shipping;

  const sendInvoiceForOrder = async ({ orderId, razorpayPaymentId, razorpayOrderId }) => {
    const customerEmail = resolveCustomerEmail();
    if (!customerEmail) {
      console.warn('Order placed, but no email found for invoice delivery.');
      return;
    }

    try {
      await sendInvoiceEmail({
        orderId,
        customer: {
          name: user?.name || 'Customer',
          email: customerEmail,
          phone: user?.phone || '',
          address: form.deliveryAddress,
          city: '',
          state: '',
          pincode: '',
        },
        items: cartItems.map(item => ({
          name: item.yarnType || item.description || 'Premium Textile',
          category: item.materialCode,
          price: Number(item.pricePerMeter || 0),
          quantity: Number(item.cartQuantity || 0),
        })),
        total: grandTotal,
        payment: {
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
        },
      });
    } catch (mailError) {
      console.warn('Invoice email failed:', mailError.message);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <ShoppingBag className="w-16 h-16 text-zinc-300 mb-4" />
        <h2 className="text-xl font-serif text-zinc-900 mb-2">Checkout Unavailable</h2>
        <p className="text-zinc-500 mb-6">Your cart is empty.</p>
        <button onClick={() => navigate('/collections')} className="px-6 py-2 bg-emerald-900 text-white rounded-md text-sm font-bold uppercase tracking-wider">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 min-h-[80vh]">
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-zinc-900 leading-tight">Secure Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Left Column: Order Summary & Item Details */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative">
          
          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
              <p className="font-bold text-emerald-900 animate-pulse">Processing Payment...</p>
            </div>
          )}

          <h2 className="text-xl font-serif text-emerald-900 mb-6 font-bold">Review Your Cart</h2>
          
          <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="h-20 w-20 bg-white rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                  {item.imageURL ? (
                    <img src={item.imageURL} alt={item.yarnType} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400">TX</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-zinc-900 leading-tight line-clamp-1">{item.yarnType}</h3>
                  <p className="text-[10px] uppercase font-bold text-emerald-600 mt-1">{item.materialCode} • {item.selectedColor}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-semibold text-zinc-500">Qty: {item.cartQuantity}</span>
                    <span className="text-sm font-bold text-zinc-900">₹{(item.pricePerMeter * item.cartQuantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 bg-zinc-50 p-6 rounded-xl border border-zinc-100 mt-6">
            <div>
              <label className="block text-sm font-bold tracking-widest uppercase text-zinc-600 mb-2">Delivery Address</label>
              <textarea
                rows={3}
                value={form.deliveryAddress}
                onChange={(e) => setForm((prev) => ({ ...prev, deliveryAddress: e.target.value }))}
                className="w-full text-sm border border-zinc-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner"
                placeholder="Full address (including postal code)"
              />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-dashed border-zinc-200">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-zinc-600"><span>Subtotal:</span> <span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-zinc-600"><span>Tax (5%):</span> <span>₹{tax.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-zinc-600"><span>Shipping:</span> <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-zinc-900 pt-4 border-t border-zinc-100">
              <span className="uppercase tracking-widest text-xs">Total to Pay:</span>
              <span className="text-3xl font-serif text-emerald-900">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Details */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <RazorpayButton amount={grandTotal}
                onSuccess={async (res) => {
                  if (!form.deliveryAddress.trim()) {
                    alert('Please provide a delivery address before checking out!');
                    return;
                  }
                  
                  setIsProcessing(true);
                  try {
                    // Create massive order containing ALL items
                    const createdOrder = await createOrder({
                      items: cartItems,
                      paymentMethod: 'Razorpay',
                      deliveryAddress: form.deliveryAddress,
                      totalPrice: grandTotal
                    });
                    
                    // Fire off the invoice in background
                    sendInvoiceForOrder({
                      orderId: createdOrder.id || createdOrder._id,
                      razorpayPaymentId: res?.razorpay_payment_id,
                      razorpayOrderId: res?.razorpay_order_id,
                    }).catch(err => console.error('Invoice background failed:', err));
                    
                    // Clear the user's cart
                    clearCart();

                    // Navigate instantly
                    navigate(`/order-confirmation?id=${createdOrder.id || createdOrder._id}`);
                  } catch (err) {
                    setIsProcessing(false);
                    alert('Order failed to save to database. ' + err.message);
                  }
                }}
                onCancel={() => {
                   alert('Payment cancelled or failed');
                }}
              /> 
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
