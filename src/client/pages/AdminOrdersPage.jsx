import { useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  MapPin, 
  User, 
  CreditCard, 
  Calendar,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  ExternalLink
} from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { cn } from '../../lib/utils';

const statuses = [
  { label: 'Pending', value: 'Pending', icon: Clock, color: 'amber' },
  { label: 'Processing', value: 'Processing', icon: Package, color: 'blue' },
  { label: 'Shipped', value: 'Shipped', icon: Truck, color: 'emerald' },
  { label: 'Delivered', value: 'Delivered', icon: CheckCircle2, color: 'zinc' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, value) => {
    try {
      await updateOrderStatus(orderId, value);
      await loadOrders();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-serif text-emerald-900 font-bold">Sales & Orders</h1>
        <p className="text-zinc-500 text-sm mt-1">Track customer orders and manage fulfillment statuses.</p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden min-h-125">
        <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            <ShoppingCart size={14} />
            Recent Orders
          </div>
          <div className="text-xs font-medium text-zinc-500">
            Total {orders.length} orders
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-500 font-bold uppercase tracking-widest text-[10px] border-b border-zinc-100">
                <th className="px-6 py-4">Customer & Order</th>
                <th className="px-6 py-4">Product Specs</th>
                <th className="px-6 py-4">Status & Logistics</th>
                <th className="px-6 py-4 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 border border-zinc-200">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{order.userId?.name || 'Guest'}</p>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono mt-0.5">
                          #{order._id.slice(-8).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <Package size={14} className="text-emerald-600" />
                        {order.materialId?.materialCode}
                      </p>
                      <p className="text-xs text-zinc-500">{order.quantity}m • {order.materialId?.yarnType} • {order.color}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                         <select
                          value={order.orderStatus}
                          onChange={(event) => handleStatusChange(order._id, event.target.value)}
                          className={cn(
                            "h-8 text-[10px] font-bold uppercase tracking-wider px-2 border rounded-md outline-none transition-all",
                            order.orderStatus === 'Delivered' ? "bg-zinc-50 border-zinc-200 text-zinc-600" :
                            order.orderStatus === 'Shipped' ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                            order.orderStatus === 'Processing' ? "bg-blue-50 border-blue-100 text-blue-700" :
                            "bg-amber-50 border-amber-100 text-amber-700"
                          )}
                        >
                          {statuses.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-start gap-1.5 text-[11px] text-zinc-500 max-w-50">
                        <MapPin size={12} className="mt-0.5 shrink-0" />
                        <span className="truncate">{order.deliveryAddress}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-zinc-900">₹{order.totalPrice.toLocaleString()}</p>
                      <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                        <CreditCard size={10} />
                        {order.paymentMethod}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && orders.length === 0 && (
                 <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-2" />
                      <p className="text-zinc-500 font-medium">Loading sales data...</p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-zinc-500">
                    No orders have been placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

