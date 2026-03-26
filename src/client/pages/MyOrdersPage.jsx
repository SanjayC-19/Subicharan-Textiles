import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (user?._id) {
        try {
          const userOrders = await getUserOrders(user._id);
          setOrders(userOrders);
          console.log('Loaded orders:', userOrders);
        } catch (err) {
          console.error('Failed to load orders', err);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn('No user._id found:', user);
      }
    };
    load();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'Shipped': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'Processing': return <Package className="w-5 h-5 text-indigo-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  useEffect(() => {
    if (!loading) {
      console.log('User:', user);
      console.log('Orders:', orders);
    }
  }, [loading, user, orders]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">Looks like you haven't made any purchases yet. Your orders will appear here once you buy something.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Order Info</th>
                  <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Quantity</th>
                  <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Total Amount</th>
                  <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Payment Method</th>
                  <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900 mb-1">{order.materialId?.yarnType || 'Item'}</div>
                      <div className="text-xs text-gray-500 font-mono">Code: {order.materialId?.materialCode || 'N/A'}</div>
                      <div className="text-xs text-gray-500 font-mono">ID: {order._id.slice(-6)}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {order.quantity} m
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">
                      ₹{order.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.orderStatus)}
                        <span className="font-medium text-gray-700">
                          {order.orderStatus || 'Pending'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}