import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';
import { Package, Truck, CheckCircle, Clock, FileText, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const userId = user?.uid || user?._id;
      if (userId) {
        try {
          const userOrders = await getUserOrders(userId);
          setOrders(userOrders);
        } catch (err) {
          console.error('Failed to load orders', err);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn('No user ID found:', user);
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Processing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase font-bold tracking-widest text-emerald-800 animate-pulse">Loading Your Portfolio...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-emerald-50/20">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        <header className="mb-14 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200/20 blur-3xl rounded-full -z-10" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-800 font-black mb-3">Portfolio</p>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-serif text-emerald-900">Order History</h1>
          </div>
          <div className="h-1 w-20 bg-emerald-600 mt-5 rounded-full" />
        </header>

        {orders.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl border border-white p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-300 rounded-full mb-6">
              <Package size={40} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-serif text-emerald-900 mb-3">No Orders Yet</h2>
            <p className="text-emerald-800 text-sm mb-8 max-w-sm mx-auto leading-relaxed">It looks like you haven't placed any orders. Discover our premium woven textiles and start your journey.</p>
            <Link to="/collections" className="bg-emerald-900 text-white px-10 py-4 font-sans text-xs tracking-widest font-bold uppercase hover:bg-emerald-800 transition-all rounded-full shadow-lg hover:shadow-emerald-900/30">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {orders.map((order, idx) => {
              const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
              const extraCount = order.items ? order.items.length - 1 : 0;

              return (
                <motion.div
                  key={order.id || order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group"
                >
                  <div className="p-6 md:p-8">

                    {/* Header: ID, Status, Date, Total */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-emerald-50/50 pb-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3">
                          <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-black text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                            Ref: {(order.id || order._id).slice(-8)}
                          </span>
                          <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold border ${getStatusBadge(order.orderStatus)}`}>
                            {order.orderStatus || 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-5 text-sm text-emerald-800 font-semibold">
                          <span className="flex items-center gap-1.5"><Calendar size={16} className="text-emerald-700" /> {date}</span>
                          <span className="hidden md:flex items-center gap-1.5"><MapPin size={16} className="text-emerald-700" /> Delivery</span>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto bg-gradient-to-br from-emerald-50 to-white px-6 py-4 rounded-xl border border-emerald-200 text-left md:text-right flex md:block justify-between items-center">
                        <p className="text-[10px] text-emerald-700 uppercase tracking-widest font-bold mb-1 block md:hidden">Total Amount</p>
                        <p className="text-2xl md:text-3xl font-serif text-emerald-900">₹{(order.totalPrice || 0).toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-emerald-700 uppercase tracking-widest font-bold mt-1.5 hidden md:block">Via {order.paymentMethod || 'Card'}</p>
                      </div>
                    </div>

                    {/* Content: Item Details */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                      <div className="w-20 h-24 md:w-24 md:h-28 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0 text-emerald-800/80 font-serif text-xl font-bold shadow-sm">
                        {firstItem?.materialCode?.substring(0, 2) || 'TX'}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg md:text-xl font-serif text-emerald-900 font-bold">
                          {firstItem?.yarnType || 'Premium Textile'}
                          {extraCount > 0 && (
                            <span className="text-sm font-normal text-emerald-700 ml-2">
                              + {extraCount} more item{extraCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </h3>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-emerald-800 font-semibold">
                          <p>Code: <span className="text-emerald-900 font-bold">{firstItem?.materialCode || 'N/A'}</span></p>
                          <p>Color: <span className="text-emerald-900 font-bold capitalize">{firstItem?.color || 'Standard'}</span></p>
                          <p>Qty: <span className="text-emerald-900 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">{firstItem?.quantity} meters</span></p>
                        </div>
                        <p className="text-xs text-emerald-700 font-medium pt-1">Order ID: {(order.id || order._id).slice(-8)}</p>
                      </div>

                      {/* Actions */}
                      <div className="w-full md:w-auto flex flex-row md:flex-col gap-3 pt-6 md:pt-0 border-t border-emerald-50 md:border-0">
                        <Link 
                          to={`/order-confirmation?id=${order.id || order._id}`}
                          className="flex-1 md:w-48 flex items-center justify-center gap-2 bg-emerald-900 text-white px-6 py-3.5 text-[10px] uppercase font-bold tracking-[0.2em] rounded-xl hover:bg-emerald-800 transition-colors shadow-md shadow-emerald-900/10"
                        >
                          <FileText size={14} /> Full Invoice
                        </Link>
                        <Link 
                          to={`/track-order/${order.id || order._id}`}
                          className="flex-1 md:w-48 flex items-center justify-center gap-2 bg-white border border-emerald-100 text-emerald-800 px-6 py-3.5 text-[10px] uppercase font-bold tracking-[0.2em] rounded-xl hover:bg-emerald-50 transition-colors"
                        >
                          <Truck size={14} className="text-emerald-600" /> Track Parcel
                        </Link>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}