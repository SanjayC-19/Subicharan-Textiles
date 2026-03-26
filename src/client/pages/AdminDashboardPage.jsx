import { useEffect, useMemo, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Package, 
  ShoppingCart, 
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Banknote,
  Users
} from 'lucide-react';
import { getMaterials } from '../services/materialService';
import { getAllOrders } from '../services/orderService';
import { getProfile } from '../services/userService';
import { cn } from '../../lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function AdminDashboardPage() {
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [materialsData, ordersData, profileData] = await Promise.all([
          getMaterials(),
          getAllOrders(),
          getProfile(),
        ]);
        setMaterials(materialsData || []);
        setOrders(ordersData || []);
        setProfile(profileData);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useGSAP(() => {
    if (!loading) {
      gsap.fromTo('.stat-card', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
      gsap.fromTo('.dashboard-section', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [loading]);

  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, item) => sum + item.totalPrice, 0);
    const lowStock = materials.filter(m => m.stock < 1000).length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    
    return [
      { 
        name: 'Total Revenue', 
        value: `₹${(totalSales/1000).toFixed(1)}k`, 
        icon: Banknote, 
        color: 'emerald',
        trend: '+12.5%', 
        trendUp: true,
        subtext: 'vs last month'
      },
      { 
        name: 'Active Orders', 
        value: pendingOrders, 
        icon: ShoppingCart, 
        color: 'blue',
        trend: '+2.0%', 
        trendUp: true,
        subtext: `${completedOrders} completed`
      },
      { 
        name: 'Inventory Items', 
        value: materials.length, 
        icon: Package, 
        color: 'violet',
        trend: `${lowStock} low stock`, 
        trendUp: lowStock === 0,
        subtext: 'Requires attention'
      },
      { 
        name: 'Total Customers', 
        value: [...new Set(orders.map(o => o.userId?._id))].length || 0, 
        icon: Users, 
        color: 'pink',
        trend: '+4.1%', 
        trendUp: true,
        subtext: 'Active accounts'
      },
    ];
  }, [orders, materials]);

  const handleExportData = () => {
    try {
      const headers = ['Order ID', 'Date', 'Amount (Rs)', 'Status', 'Payment Method', 'Payment Status', 'Customer Details'];
      
      const csvContent = [
        headers.join(','),
        ...orders.map(o => {
          const date = new Date(o.createdAt).toLocaleDateString();
          const customer = `"${o.shippingAddress?.fullName || 'N/A'} - ${o.shippingAddress?.city || 'N/A'}"`;
          return `"${o._id}","${date}","${o.totalPrice || 0}","${o.orderStatus}","${o.paymentMethod || 'N/A'}","${o.paymentStatus || 'N/A'}",${customer}`;
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sales_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export data.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-zinc-500 font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 dashboard-section">
        <div>
          <h1 className="text-3xl font-serif text-zinc-900 leading-tight">Overview</h1>
          <p className="text-zinc-500 mt-1">
            Welcome back, <span className="font-medium text-zinc-800">{profile?.name?.split(' ')[0] || 'Admin'}</span>. Here's your business at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportData}
            className="px-5 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
          >
            Export Data
          </button>
          <button 
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="stat-card bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-12 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${
                stat.color === 'emerald' ? 'bg-emerald-500' :
                stat.color === 'blue' ? 'bg-blue-500' :
                stat.color === 'violet' ? 'bg-violet-500' : 'bg-pink-500'
            }`} />
            
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                stat.color === 'violet' ? 'bg-violet-50 text-violet-600 border-violet-100' :
                'bg-pink-50 text-pink-600 border-pink-100'
              }`}>
                <stat.icon size={22} strokeWidth={2} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full",
                stat.trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700" // changed to red for alert consistency
              )}>
                {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </div>
            </div>
            
            <div className="relative z-10 block">
              <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-medium text-zinc-600">{stat.name}</p>
                <span className="text-xs text-zinc-400">{stat.subtext}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 dashboard-section bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <h2 className="font-serif text-xl font-medium text-zinc-900">Recent Transactions</h2>
            <button className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">
                          {(order.userId?.name || 'G')[0].toUpperCase()}
                        </div>
                        <p className="font-medium text-zinc-900">{order.userId?.name || 'Guest User'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      ₹{order.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                        order.orderStatus === 'completed' ? "bg-emerald-50 text-emerald-700" : 
                        order.orderStatus === 'pending' ? "bg-amber-50 text-amber-700" : 
                        "bg-zinc-100 text-zinc-700"
                      )}>
                        {order.orderStatus === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-zinc-500 flex flex-col items-center justify-center">
                      <ShoppingCart size={32} className="text-zinc-300 mb-3" />
                      <p>No recent orders found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-zinc-100 bg-zinc-50 text-center">
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All Orders</button>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="dashboard-section bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-amber-50/30">
            <h2 className="font-serif text-xl font-medium text-zinc-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Stock Alerts
            </h2>
          </div>
          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-100">
            {materials.filter(m => m.stock < 1000).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-10">
                <CheckCircle2 size={32} className="text-emerald-400 mb-3" />
                <p>All stock levels are optimal.</p>
              </div>
            ) : (
              materials.filter(m => m.stock < 1000).slice(0, 5).map(material => (
                <div key={material._id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-amber-200 shadow-sm hover:border-amber-300 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-10 rounded-full bg-amber-400"></div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">{material.materialCode}</p>
                      <p className="text-xs text-zinc-500 capitalize">{material.yarnType} • {material.color}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600 text-lg">{material.stock.toLocaleString()} <span className="text-sm font-normal text-amber-500">m</span></p>
                    <p className="text-[10px] text-amber-700/80 uppercase tracking-widest font-bold">Critically Low</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-zinc-100 text-center">
            <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Manage Inventory</button>
          </div>
        </div>
      </div>
    </div>
  );
}

