import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const Invoice = ({ order }) => {
  if (!order) return null;

  const {
    id: orderId,
    userId: customer,
    deliveryAddress,
    items: orderItems,
    totalPrice: total,
    createdAt
  } = order;

  // Map to the format we need
  const items = orderItems ? orderItems.map(item => ({
    name: item.yarnType || 'Premium Textile',
    category: `${item.materialCode || 'N/A'} • ${item.color || 'Standard'}`,
    price: item.pricePerMeter || 0,
    quantity: item.quantity || 1,
  })) : [];
  const subtotal = total;
  const tax = 0;
  const shipping = 0;

  const date = createdAt ? new Date(createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  return (
    <div className="relative bg-white/80 backdrop-blur-xl text-slate-800 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white/20 max-w-4xl mx-auto my-8 font-sans transition-all hover:shadow-emerald-900/5 rounded-xl overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-400" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-200 pb-10 gap-8">
        <div>
          <h1 className="text-4xl font-serif text-emerald-900 tracking-tight mb-2">Loyal Textile Mills</h1>
          <p className="text-emerald-700/60 text-sm max-w-xs leading-relaxed font-medium">
            Since 1946. Traditionally woven, modernly styled. Premium South Indian Textiles.
          </p>

          <div className="mt-6 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-emerald-800/70">
              <Globe size={14} className="text-emerald-600" />
              <span>www.loyaltextiles.com</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-800/70">
              <Mail size={14} className="text-emerald-600" />
              <span>support@loyaltextiles.com</span>
            </div>

          </div>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full mb-4 border border-emerald-100">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Tax Invoice</span>
          </div>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice Number</p>
          <h2 className="text-3xl font-serif text-emerald-900 mb-6">{orderId}</h2>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block text-left">
            <p className="mb-1.5 flex justify-between gap-4"><span>Order Date:</span> <span className="text-slate-900 font-bold">{date}</span></p>
            <p className="flex justify-between gap-4"><span>Order Status:</span> <span className="text-emerald-600 font-bold uppercase tracking-tight">{order.orderStatus || 'Pending'}</span></p>
          </div>

        </div>
      </div>

      {/* Addresses */}
      <div className="grid md:grid-cols-2 gap-12 py-10">
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">Billed To</h3>
          <div className="space-y-1">
            <p className="font-serif text-lg text-slate-900">{customer?.name || 'Customer'}</p>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">{deliveryAddress}</p>
            <div className="pt-2 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail size={12} />
                <span>{customer?.email || ''}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:text-right">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4 italic">Shipped From</h3>
          <div className="space-y-1 text-emerald-900">
            <p className="font-serif text-lg">Loyal Textile Mills Center</p>
            <p className="text-sm text-slate-600 leading-relaxed">21/4, Mill Street, Kovilpatti</p>
            <p className="text-sm text-slate-600">Tuticorin District, TN - 628501</p>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs text-slate-500">
              <MapPin size={12} />
              <span>Fulfillment Center #104</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/50">
              <th className="py-4 px-2 text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold">Item Description</th>
              <th className="py-4 px-2 text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold text-center">Qty</th>
              <th className="py-4 px-2 text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold text-right">Price</th>
              <th className="py-4 px-2 text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item, idx) => (
              <tr key={idx} className="group">
                <td className="py-5 px-2">
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{item.category}</p>
                </td>
                <td className="py-5 px-2 text-center text-sm text-slate-600">{item.quantity}</td>
                <td className="py-5 px-2 text-right text-sm text-slate-600">₹{item.price.toLocaleString('en-IN')}</td>
                <td className="py-5 px-2 text-right text-sm font-medium text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-8 flex justify-end">
        <div className="w-full md:w-72 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Shipping</span>
            <span className="text-slate-900">{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">GST (5%)</span>
            <span className="text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="pt-4 border-t-2 border-slate-200 flex justify-between items-baseline">
            <span className="text-lg font-serif text-slate-900">Final Amount</span>
            <span className="text-3xl font-serif text-emerald-700">₹{total.toLocaleString('en-IN')}</span>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mb-2 font-medium">Thank you for your business</p>
        <p className="text-[9px] text-slate-300 max-w-sm mx-auto lowercase">
          This is a computer generated invoice and does not require a signature. For any discrepancies, please reach out to support within 7 days.
        </p>
      </div>
      
      {/* Print Button (Hidden on print) */}
      <div className="mt-12 no-print flex justify-center">
        <button 
          onClick={() => window.print()}
          className="bg-emerald-900 text-white px-10 py-4 font-sans text-[11px] tracking-[0.25em] uppercase hover:bg-emerald-700 transition-all rounded-full shadow-xl hover:shadow-emerald-900/30 font-bold"
        >
          Generate PDF Invoice
        </button>
      </div>


      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .shadow-2xl { box-shadow: none !important; }
          .border { border: none !important; }
        }
      `}} />
    </div>
  );
};

export default Invoice;
