import React, { useEffect, useState } from 'react';
import { getOrdersByUser } from '../services/orderService';
import { Package, Calendar, MapPin, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse user once outside effect to get a stable uid string
  const user = JSON.parse(localStorage.getItem('authUser'));
  const userId = user?.uid || null;

  useEffect(() => {
    if (userId) {
      getOrdersByUser(userId)
        .then(setOrders)
        .catch((err) => {
          console.error('Failed to fetch orders:', err);
          setOrders([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (!user) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <h1 className="text-3xl font-serif mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8">Please login to view your orders.</p>
        <Link to="/login" className="bg-primary text-white px-8 py-3 rounded-sm uppercase tracking-widest text-[10px]">Login Now</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-emerald-50/20">
      <div className="max-w-5xl mx-auto px-6">
        
        <header className="mb-14 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200/20 blur-3xl rounded-full -z-10" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-800 font-black mb-3">Portfolio</p>
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-900">Your Order History</h1>
          <div className="h-1 w-20 bg-emerald-600 mt-4 rounded-full" />
        </header>


        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-white animate-pulse rounded-sm border border-slate-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-slate-100 p-16 text-center shadow-sm rounded-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-slate-300 rounded-full mb-6">
              <Package size={32} strokeWidth={1} />
            </div>
            <h2 className="text-xl font-serif text-slate-900 mb-2">No orders found</h2>
            <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto leading-relaxed">It looks like you haven't placed any orders yet. Start exploring our collections today!</p>
            <Link to="/products" className="bg-slate-900 text-white px-8 py-3 font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-primary transition-all">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-100 shadow-sm rounded-sm overflow-hidden hover:border-primary/20 transition-all group"
              >
                <div className="p-8">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-[11px] uppercase tracking-[0.2em] font-black text-emerald-900">Ref: {order.orderId}</span>
                        <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold border ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {order.status || 'Processing'}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-2 italic"><Calendar size={13} className="text-emerald-600/40" /> {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        <span className="flex items-center gap-2 uppercase tracking-tighter"><MapPin size={13} className="text-emerald-600/40" /> {order.customer?.city || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="bg-emerald-50/50 px-6 py-3 rounded-xl border border-emerald-100/50 text-right">
                      <p className="text-xl font-serif text-emerald-900">₹{(order.total || 0).toLocaleString('en-IN')}</p>
                      <p className="text-[9px] text-emerald-600/60 uppercase tracking-[0.15em] font-bold mt-1">{(order.items || []).length} Curated {(order.items || []).length === 1 ? 'Item' : 'Items'}</p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    {(order.items || []).slice(0, 4).map((item, i) => (

                      <div key={i} className="w-16 h-20 bg-slate-50 border border-slate-100 flex-shrink-0 relative">
                        <img 
                          src={item.imageURL || item.image || 'https://via.placeholder.com/64x80'} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                        {item.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white tabular-nums">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {(order.items || []).length > 4 && (
                      <div className="w-16 h-20 bg-slate-50 border border-slate-100 flex items-center justify-center text-xs text-slate-400 font-medium">
                        +{(order.items || []).length - 4}
                      </div>
                    )}
                  </div>


                  {/* Footer Actions */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <div className="flex items-center text-[10px] text-slate-400 uppercase tracking-widest gap-4">
                      <span>Payment: {order.payment?.razorpay_payment_id ? 'Razorpay' : 'COD'}</span>
                    </div>
                    <Link 
                      to={`/order-confirmation?id=${order.orderId}`}
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:gap-3 transition-all"
                    >
                      View Details & Invoice <Eye size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
