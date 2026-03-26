import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMaterials } from '../services/materialService';
import { createOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Banknote, Landmark, Truck, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
// Removed RazorpayButton import

export default function OrderPage() {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [material, setMaterial] = useState(null);
  const [form, setForm] = useState({
    quantity: 1,
    color: '',
    paymentMethod: 'Credit Card',
    deliveryAddress: user?.address || '',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getMaterials();
      const selected = data.find((item) => item._id === materialId);
      setMaterial(selected || null);
      if (selected) {
        setForm((prev) => ({ ...prev, color: selected.color }));
      }
    };
    load();
  }, [materialId]);

  const total = useMemo(() => {
    if (!material) return 0;
    return Number(material.pricePerMeter) * Number(form.quantity || 0);
  }, [form.quantity, material]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!material) return;

    // Simulate payment processing if it's not Cash on delivery or Bank transfer
    if (form.paymentMethod === 'Credit Card' || form.paymentMethod === 'UPI') {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setPaymentSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      await createOrder({
        materialId: material._id,
        quantity: Number(form.quantity),
        color: form.color,
        paymentMethod: form.paymentMethod,
        deliveryAddress: form.deliveryAddress,
      });
      // Navigate to the newly created orders page
      navigate('/orders');
    } catch (error) {
      alert(error.message);
      setPaymentSuccess(false);
      setIsProcessing(false);
    }
  };

  if (!material) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Order Summary & Item Details */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h1 className="text-2xl font-serif text-emerald-900 mb-6 font-bold">Order Summary</h1>
          
          <div className="flex gap-4 p-4 bg-emerald-50 rounded-xl mb-6">
            <div className="h-24 w-24 bg-white rounded-lg flex items-center justify-center shrink-0 text-emerald-800 font-bold border border-emerald-100">
              {material.materialCode}
            </div>
            <div>
              <h3 className="font-bold text-lg text-emerald-900">{material.yarnType}</h3>
              <p className="text-gray-600 text-sm mt-1">{material.description || 'Premium woven textile.'}</p>
              <div className="mt-2 font-mono text-emerald-700 font-semibold">₹{material.pricePerMeter} / meter</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (meters)</label>
              <input
                type="number"
                min={1}
                max={material.stock}
                value={form.quantity}
                onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Color / Dye</label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
              <textarea
                rows={3}
                value={form.deliveryAddress}
                onChange={(e) => setForm((prev) => ({ ...prev, deliveryAddress: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Full address (including postal code)"
              />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
            <div className="flex justify-between items-center text-lg font-bold text-emerald-900">
              <span>Total to Pay:</span>
              <span className="text-2xl font-mono">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Checkout */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* RazorpayButton removed */}
          </form>
        </div>
      </div>
    </section>
  );
}
