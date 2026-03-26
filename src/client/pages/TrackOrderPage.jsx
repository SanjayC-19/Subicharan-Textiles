import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderByOrderId } from '../services/orderService';
import { Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrackOrderPage() {
  const { orderId } = useParams();
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
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase font-bold tracking-widest text-emerald-800 animate-pulse">Locating Parcel...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <h1 className="text-3xl font-serif mb-4 text-emerald-900">Order Not Found</h1>
        <p className="text-emerald-800 mb-8 max-w-sm mx-auto font-medium">We couldn't locate tracking details for this reference number.</p>
        <Link to="/orders" className="bg-emerald-900 text-white px-8 py-3 rounded-full uppercase tracking-widest text-[10px] shadow-md font-bold hover:bg-emerald-800 transition-colors">Back to My Orders</Link>
      </div>
    );
  }

  // Determine current step index based on order status
  const getStepIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver')) return 3;
    if (s.includes('ship') || s.includes('dispatch') || s.includes('transit')) return 2;
    if (s.includes('process') || s.includes('pack')) return 1;
    return 0; // Ordered/Pending
  };

  const currentStep = getStepIndex(order.orderStatus);
  const orderDate = new Date(order.createdAt);
  
  // Simulate timeline dates for realism
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const timeline = [
    { 
      title: 'Order Placed', 
      desc: 'We have received your order.', 
      icon: Package, 
      date: orderDate,
      completed: currentStep >= 0 
    },
    { 
      title: 'Processing', 
      desc: 'Your items are being carefully packed by our weavers.', 
      icon: Clock, 
      date: addDays(orderDate, 1),
      completed: currentStep >= 1 
    },
    { 
      title: 'Shipped', 
      desc: 'The parcel has been picked up by our courier partner.', 
      icon: Truck, 
      date: addDays(orderDate, 3),
      completed: currentStep >= 2 
    },
    { 
      title: 'Delivered', 
      desc: 'Package has been delivered to your location.', 
      icon: CheckCircle, 
      date: addDays(orderDate, 5),
      completed: currentStep >= 3 
    }
  ];

  // Assuming delivery takes 5 days from order if not actually delivered yet
  const expectedDeliveryDate = addDays(orderDate, 5).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  const actualDeliveryDate = timeline[3].date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <main className="min-h-screen pt-24 pb-20 bg-emerald-50/20">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        
        {/* Navigation & Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link to="/orders" className="w-10 h-10 bg-white border border-emerald-200 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-50 transition-colors shadow-sm">
            <ArrowLeft size={18} className="font-bold" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-emerald-900 font-bold">Track Your Parcel</h1>
            <p className="text-xs text-emerald-800 font-bold tracking-wide mt-1 uppercase">ID: {order.id || order._id}</p>
          </div>
        </div>

        {/* Expected Delivery Banner */}
        <div className="bg-emerald-900 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 blur-xl">
             <Truck size={150} />
          </div>
          <div className="relative z-10 w-full mb-4 md:mb-0">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400 mb-1">
              {currentStep === 3 ? 'Delivered On' : 'Arriving By'}
            </p>
            <h2 className="text-3xl font-serif">
              {currentStep === 3 ? actualDeliveryDate : expectedDeliveryDate}
            </h2>
          </div>
          <div className="relative z-10 w-full md:w-auto text-left md:text-right">
            <p className="text-xs text-emerald-300">Status</p>
            <p className="text-lg font-bold capitalize">{order.orderStatus || 'Pending'}</p>
          </div>
        </div>

        {/* Timeline Tracking */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-6 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] mb-8">
          <h3 className="text-lg font-serif text-emerald-900 mb-8 pb-4 border-b border-emerald-50">Shipment Activity</h3>
          
          <div className="relative pl-6 md:pl-8 space-y-12 before:absolute before:inset-0 before:ml-[15px] md:before:ml-[23px] before:w-0.5 before:bg-emerald-50 before:h-full before:-z-10">
            {timeline.map((step, index) => {
              const isLast = index === timeline.length - 1;
              const isCurrent = currentStep === index;
              const isPending = currentStep < index;
              
              return (
                <div key={index} className="relative z-10">
                  {/* Status Indicator / Dot */}
                  <div className={`absolute -left-6 md:-left-8 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    step.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 
                    'bg-white border-emerald-100 text-emerald-200'
                  }`}>
                    {step.completed ? <CheckCircle size={12} strokeWidth={3} /> : <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full" />}
                  </div>

                  {/* Pulsing effect for the active step */}
                  {isCurrent && !isLast && (
                    <div className="absolute -left-6 md:-left-8 w-6 h-6 rounded-full border border-emerald-400 animate-ping opacity-50"></div>
                  )}

                  <div className={`pl-6 md:pl-8 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                      <h4 className={`text-base font-bold ${isPending ? 'text-slate-500' : 'text-emerald-900'}`}>{step.title}</h4>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-800">
                        {step.completed ? step.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' }) : 'Pending'}
                      </p>
                    </div>
                    <p className="text-sm text-slate-700 font-medium max-w-md">{step.desc}</p>
                    
                    {/* Visual icon for completed or processing steps */}
                    {step.completed && (
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-200">
                        <step.icon size={14} className="opacity-100 text-emerald-700" /> Updates processed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Summary */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-6 items-center">
          <div className="w-20 h-24 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center shrink-0 text-emerald-900 font-serif font-bold text-xl">
            {order.materialId?.materialCode?.substring(0, 2) || 'TX'}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-serif font-bold text-emerald-900 text-lg">{order.materialId?.yarnType || 'Premium Textile'}</h4>
            <p className="text-sm text-emerald-800 font-semibold mt-1">Color: <span className="capitalize">{order.color || 'Standard'}</span> &middot; Qty: {order.quantity} meters</p>
          </div>
          <div className="text-right w-full md:w-auto border-t md:border-t-0 border-emerald-100 pt-4 md:pt-0">
             <Link 
              to={`/order-confirmation?id=${order.id || order._id}`}
              className="text-[10px] uppercase tracking-widest font-black text-emerald-700 hover:text-emerald-900 transition-colors"
             >
                View Full Invoice &rarr;
             </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
