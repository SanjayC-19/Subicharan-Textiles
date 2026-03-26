import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getOrderByOrderId } from '../services/orderService';
import Invoice from '../components/Invoice';
import { CheckCircle, Truck, Package, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderByOrderId(orderId)
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-sans text-xs tracking-widest uppercase text-muted-foreground">Confirming your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <h1 className="text-3xl font-serif mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find the order details you're looking for.</p>
        <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-sm uppercase tracking-widest text-[10px]">Back to Shop</Link>
      </div>
    );
  }

  const steps = [
    { label: 'Ordered', icon: Package, active: true },
    { label: 'Processing', icon: Clock, active: order.orderStatus === 'Processing' || order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' },
    { label: 'Shipped', icon: Truck, active: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' },
    { label: 'Delivered', icon: CheckCircle, active: order.orderStatus === 'Delivered' }
  ];

  return (
    <main className="min-h-screen pt-24 pb-20 bg-emerald-50/30 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-200/20 blur-[100px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-100/30 blur-[80px] rounded-full -z-10" />

        {/* Success Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white shadow-xl shadow-emerald-900/5 text-emerald-600 rounded-full mb-8 relative">
            <div className="absolute inset-0 rounded-full border border-emerald-100 animate-ping opacity-20" />
            <CheckCircle size={48} strokeWidth={1} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-800 mb-2">Transaction Confirmed</p>
          <h1 className="text-4xl md:text-6xl font-serif text-emerald-900 mb-6 tracking-tight">Thank You For Choosing Quality</h1>
          <p className="text-slate-500 max-w-lg mx-auto leading-relaxed text-sm">
            Your order <span className="text-emerald-900 font-bold">#{order.id || order._id}</span> has been successfully placed. We're now preparing your premium textiles for delivery.
          </p>
        </motion.div>


        {/* Tracking Progress */}
        <section className="bg-white/60 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 mb-12 rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600/10" />
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-emerald-800/40 font-bold mb-10 text-center">Journey of Your Purchase</h2>
          <div className="relative flex justify-between items-start max-w-3xl mx-auto">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-emerald-50 -z-0" />
            <div 
              className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-emerald-800 to-emerald-400 transition-all duration-1000 -z-0" 
              style={{ width: `${(steps.filter(s => s.active).length - 1) / (steps.length - 1) * 100}%` }}
            />

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${step.active ? 'bg-emerald-900 border-emerald-900 text-white shadow-lg shadow-emerald-900/20 scale-110' : 'bg-white border-emerald-50 text-emerald-100'}`}>
                  <step.icon size={18} />
                </div>
                <p className={`mt-4 text-[9px] uppercase tracking-[0.2em] font-bold ${step.active ? 'text-emerald-900' : 'text-emerald-100'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* Invoice Section */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-serif text-slate-900">Order Invoice</h2>
            <Link to="/orders" className="text-[10px] uppercase tracking-widest text-primary flex items-center gap-2 hover:opacity-70 transition-opacity">
              View Order History <ArrowRight size={14} />
            </Link>
          </div>
          <Invoice order={order} />
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-12 no-print">
          <Link to="/products" className="bg-slate-900 text-white px-10 py-4 font-sans text-[11px] tracking-[0.2em] uppercase hover:bg-primary transition-all text-center">
            Keep Shopping
          </Link>
          <Link to="/" className="border border-slate-200 text-slate-400 px-10 py-4 font-sans text-[11px] tracking-[0.2em] uppercase hover:border-slate-900 hover:text-slate-900 transition-all text-center">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmation;
