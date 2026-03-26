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
  Users,
  BarChart3
} from 'lucide-react';
import { getMaterials } from '../services/materialService';
import { getAllOrders } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { cn } from '../../lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b', '#d97706', '#3b82f6', '#2563eb', '#1d4ed8', '#8b5cf6', '#7c3aed'];

// Custom tooltip for the charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl shadow-xl p-4 text-sm">
        <p className="font-bold text-zinc-800 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.name === 'Revenue' ? `₹${Number(entry.value).toLocaleString('en-IN')}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const load = async () => {
      try {
        const [materialsData, ordersData] = await Promise.all([
          getMaterials(),
          getAllOrders(),
        ]);
        setMaterials(materialsData || []);
        setOrders(ordersData || []);
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
        value: `₹${(totalSales / 1000).toFixed(1)}k`,
        icon: Banknote,
        color: 'emerald',
        trend: '+12.5%',
        trendUp: true,
        subtext: 'all time'
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

  // ─── Compute monthly breakdown for charts ────────────────────────────────────
  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const map = {};

    MONTHS.forEach((m, i) => {
      map[i] = { month: m, Revenue: 0, Orders: 0, Delivered: 0, Pending: 0 };
    });

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      if (date.getFullYear() !== currentYear) return;
      const mo = date.getMonth();
      map[mo].Revenue += order.totalPrice || 0;
      map[mo].Orders += 1;
      if (order.orderStatus === 'Delivered') map[mo].Delivered += 1;
      if (order.orderStatus === 'Pending') map[mo].Pending += 1;
    });

    return Object.values(map);
  }, [orders]);

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const totalSales = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
    const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const uniqueCustomers = [...new Set(orders.map(o => o.userId?._id))].length;
    const generatedOn = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    doc.setFillColor(6, 78, 59);
    doc.rect(0, 0, 210, 42, 'F');
    doc.setFontSize(22); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('SUBICHARAN TEXTILES', 14, 20);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(167, 243, 208);
    doc.text('Sales Report — Compiled by Admin System', 14, 29);
    doc.text(`Generated: ${generatedOn}`, 14, 37);

    doc.setTextColor(30, 30, 30); doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Business Summary', 14, 56);
    doc.setDrawColor(220, 220, 220); doc.line(14, 59, 196, 59);

    autoTable(doc, {
      startY: 63,
      body: [
        ['Total Revenue', `Rs. ${totalSales.toLocaleString('en-IN')}`, 'Total Orders', String(orders.length)],
        ['Active (Pending)', String(pendingOrders), 'Delivered', String(deliveredOrders)],
        ['Inventory Items', String(materials.length), 'Unique Customers', String(uniqueCustomers)],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [80, 80, 80], fillColor: [248, 250, 252] },
        1: { fontStyle: 'bold', textColor: [6, 78, 59] },
        2: { fontStyle: 'bold', textColor: [80, 80, 80], fillColor: [248, 250, 252] },
        3: { fontStyle: 'bold', textColor: [6, 78, 59] },
      },
    });

    const afterSummary = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 30, 30);
    doc.text('Monthly Breakdown', 14, afterSummary);
    doc.line(14, afterSummary + 3, 196, afterSummary + 3);

    autoTable(doc, {
      startY: afterSummary + 7,
      head: [['Month', 'Revenue (Rs.)', 'Total Orders', 'Delivered', 'Pending']],
      body: monthlyData.map(m => [
        m.month, m.Revenue.toLocaleString('en-IN'), m.Orders, m.Delivered, m.Pending
      ]),
      theme: 'striped',
      headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
    });

    const afterMonthly = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 30, 30);
    doc.text('Order Details', 14, afterMonthly);
    doc.line(14, afterMonthly + 3, 196, afterMonthly + 3);

    autoTable(doc, {
      startY: afterMonthly + 7,
      head: [['#', 'Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Payment']],
      body: orders.map((o, i) => [
        i + 1, (o.id || o._id || '').slice(-8), o.userId?.name || 'Guest',
        new Date(o.createdAt).toLocaleDateString('en-IN'),
        `Rs. ${(o.totalPrice || 0).toLocaleString('en-IN')}`, o.orderStatus || 'Pending', o.paymentMethod || 'N/A',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setTextColor(150);
      doc.text(`Subicharan Textiles • Confidential Sales Report • Page ${i} of ${pageCount}`, 14, 290);
    }
    doc.save(`Sales_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportData = () => {
    try {
      const headers = ['Order ID', 'Date', 'Customer', 'Amount (Rs)', 'Status', 'Payment Method'];
      const csvContent = [
        headers.join(','),
        ...orders.map(o => {
          const date = new Date(o.createdAt).toLocaleDateString();
          return `"${o._id}","${date}","${o.userId?.name || 'Guest'}","${o.totalPrice || 0}","${o.orderStatus}","${o.paymentMethod || 'N/A'}"`;
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', `sales_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed', err);
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
            Welcome back, <span className="font-medium text-zinc-800">{user?.name?.split(' ')[0] || 'Admin'}</span>. Here's your business at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="px-5 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
          >
            Export CSV
          </button>
          <button
            onClick={generatePDF}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <ArrowUpRight size={16} /> Generate Report PDF
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="stat-card bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-12 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${stat.color === 'emerald' ? 'bg-emerald-500' :
                stat.color === 'blue' ? 'bg-blue-500' :
                  stat.color === 'violet' ? 'bg-violet-500' : 'bg-pink-500'
              }`} />

            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    stat.color === 'violet' ? 'bg-violet-50 text-violet-600 border-violet-100' :
                      'bg-pink-50 text-pink-600 border-pink-100'
                }`}>
                <stat.icon size={22} strokeWidth={2} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full",
                stat.trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
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

      {/* ─── Charts Section ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 dashboard-section">

        {/* Revenue Bar Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl font-medium text-zinc-900">Monthly Revenue</h2>
              <p className="text-xs text-zinc-400 mt-1">Total sales revenue per month — {new Date().getFullYear()}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <BarChart3 size={20} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Revenue" name="Revenue" stroke="#059669" strokeWidth={2.5} fill="url(#revenueGradient)" dot={{ fill: '#059669', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#065f46' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 overflow-hidden">
          <div className="mb-6">
            <h2 className="font-serif text-xl font-medium text-zinc-900">Orders per Month</h2>
            <p className="text-xs text-zinc-400 mt-1">Pending vs Delivered — {new Date().getFullYear()}</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b', paddingTop: '8px' }} />
              <Bar dataKey="Delivered" name="Delivered" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pending" name="Pending" fill="#fbbf24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Monthly Product Analysis Section ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 dashboard-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-xl font-medium text-zinc-900">Monthly Product Analysis</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Quantity-based sales breakdown for {MONTHS[selectedMonth]} {new Date().getFullYear()}</p>
          </div>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="border border-zinc-200 rounded-xl px-4 py-2 text-sm font-semibold text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm cursor-pointer"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m} {new Date().getFullYear()}</option>
            ))}
          </select>
        </div>

        {(() => {
          const currentYear = new Date().getFullYear();
          const productMap = {};
          orders.forEach(order => {
            const d = new Date(order.createdAt);
            if (d.getFullYear() !== currentYear || d.getMonth() !== selectedMonth) return;
            const items = order.items || [];
            if (items.length === 0 && order.materialId) {
              const key = order.materialId?.yarnType || 'Other';
              productMap[key] = (productMap[key] || 0) + (order.quantity || 0);
            }
            items.forEach(item => {
              const key = item.yarnType || item.materialCode || 'Other';
              productMap[key] = (productMap[key] || 0) + (item.quantity || 0);
            });
          });

          const pieData = Object.entries(productMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a,b) => b.value - a.value);
          
          const totalQty = pieData.reduce((s, d) => s + d.value, 0);
          const monthOrders = orders.filter(o => {
            const d = new Date(o.createdAt);
            return d.getFullYear() === currentYear && d.getMonth() === selectedMonth;
          });
          const monthRevenue = monthOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);

          if (pieData.length === 0) {
            return (
              <div className="h-64 flex flex-col items-center justify-center text-zinc-400 gap-3 border-2 border-dashed border-zinc-100 rounded-2xl">
                <Package size={40} className="text-zinc-200" />
                <p className="text-sm font-medium">No sales data available for {MONTHS[selectedMonth]}</p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Pie Chart */}
              <div className="h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(v) => [`${v.toLocaleString()} m`, 'Quantity']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-zinc-900">{totalQty.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Total Meters</span>
                </div>
              </div>

              {/* Product List & Stats */}
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 text-center">
                    <p className="text-xl font-black text-emerald-800 tracking-tight">{monthOrders.length}</p>
                    <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest mt-1">Orders</p>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 text-center">
                    <p className="text-xl font-black text-blue-800 tracking-tight">₹{(monthRevenue/1000).toFixed(1)}k</p>
                    <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest mt-1">Revenue</p>
                  </div>
                  <div className="bg-violet-50/50 p-4 rounded-2xl border border-violet-100/50 text-center">
                    <p className="text-xl font-black text-violet-800 tracking-tight">{pieData.length}</p>
                    <p className="text-[10px] font-bold text-violet-600/70 uppercase tracking-widest mt-1">Types</p>
                  </div>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {pieData.map((item, index) => {
                    const percentage = totalQty > 0 ? ((item.value / totalQty) * 100).toFixed(1) : 0;
                    return (
                      <div key={item.name} className="flex items-center gap-4 group">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-semibold text-zinc-700">{item.name}</span>
                            <span className="text-[11px] font-black text-zinc-900">{item.value.toLocaleString()}m</span>
                          </div>
                          <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: PIE_COLORS[index % PIE_COLORS.length]
                              }} 
                            />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 w-8 text-right">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Monthly Breakdown Table */}
      <div className="dashboard-section bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium text-zinc-900">Monthly Breakdown</h2>
          <span className="text-xs text-zinc-400 font-medium">{new Date().getFullYear()}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/30">
                {['Month', 'Revenue', 'Total Orders', 'Delivered', 'Pending', 'Avg. Order Value'].map(h => (
                  <th key={h} className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {monthlyData.map((m) => (
                <tr key={m.month} className={cn("hover:bg-zinc-50/80 transition-colors", m.Revenue === 0 && "opacity-50")}>
                  <td className="px-6 py-3.5 font-bold text-zinc-800">{m.month}</td>
                  <td className="px-6 py-3.5 font-semibold text-emerald-700">₹{m.Revenue.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3.5 text-zinc-700 font-medium">{m.Orders}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      <CheckCircle2 size={10} /> {m.Delivered}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
                      m.Pending > 0 ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-400"
                    )}>
                      <Clock size={10} /> {m.Pending}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-zinc-600 text-sm">
                    {m.Orders > 0 ? `₹${Math.round(m.Revenue / m.Orders).toLocaleString('en-IN')}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-emerald-50/50 border-t-2 border-emerald-100">
                <td className="px-6 py-3.5 font-black text-zinc-900 text-xs uppercase tracking-widest">Total</td>
                <td className="px-6 py-3.5 font-black text-emerald-800">₹{orders.reduce((s, o) => s + (o.totalPrice || 0), 0).toLocaleString('en-IN')}</td>
                <td className="px-6 py-3.5 font-black text-zinc-900">{orders.length}</td>
                <td className="px-6 py-3.5 font-black text-emerald-700">{orders.filter(o => o.orderStatus === 'Delivered').length}</td>
                <td className="px-6 py-3.5 font-black text-amber-700">{orders.filter(o => o.orderStatus === 'Pending').length}</td>
                <td className="px-6 py-3.5 font-black text-zinc-500">{orders.length > 0 ? `₹${Math.round(orders.reduce((s, o) => s + (o.totalPrice || 0), 0) / orders.length).toLocaleString('en-IN')}` : '—'}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bottom Section: Recent Orders + Stock Alerts */}
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
                        order.orderStatus === 'Delivered' ? "bg-emerald-50 text-emerald-700" :
                          order.orderStatus === 'Pending' ? "bg-amber-50 text-amber-700" :
                            "bg-zinc-100 text-zinc-700"
                      )}>
                        {order.orderStatus === 'Delivered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-zinc-500">
                      <ShoppingCart size={32} className="text-zinc-300 mb-3 mx-auto" />
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
