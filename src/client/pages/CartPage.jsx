import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-24 bg-zinc-50 flex items-center justify-center px-4">
        <div className="bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-zinc-100 max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-emerald-600" />
          </div>
          <h1 className="text-3xl font-serif text-zinc-900 mb-3">Your Cart is Empty</h1>
          <p className="text-zinc-500 mb-8 leading-relaxed text-sm">
            Looks like you haven't added any premium textiles to your cart yet. Explore our collections and find something beautiful.
          </p>
          <Link 
            to="/collections" 
            className="inline-flex items-center justify-center bg-emerald-900 text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-emerald-800 transition-colors shadow-lg"
          >
            Explore Collections
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; // Dummy 5% tax
  const shipping = subtotal > 5000 ? 0 : 250;
  const grandTotal = subtotal + tax + shipping;

  return (
    <main className="min-h-screen pt-24 pb-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 pt-6">
          <h1 className="text-3xl md:text-4xl font-serif text-zinc-900 leading-tight">Shopping Cart</h1>
          <p className="text-zinc-500 mt-2 font-medium">{getCartCount()} Items Selected</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-6 border-b border-zinc-100 bg-zinc-50/50">
                <div className="col-span-6 text-[10px] font-bold tracking-widest uppercase text-zinc-400">Product</div>
                <div className="col-span-3 text-[10px] font-bold tracking-widest text-center uppercase text-zinc-400">Quantity</div>
                <div className="col-span-3 text-[10px] font-bold tracking-widest text-right uppercase text-zinc-400">Total</div>
              </div>
              
              <div className="divide-y divide-zinc-100">
                {cartItems.map((item, index) => (
                  <div key={`${item._id}-${item.selectedColor}-${index}`} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center group transition-colors hover:bg-zinc-50/50">
                    
                    {/* Image & Details */}
                    <div className="sm:col-span-6 flex gap-4 sm:gap-6">
                      <Link to="/collections" className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 block">
                        {item.imageURL ? (
                          <img src={item.imageURL} alt={item.yarnType} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-serif font-bold text-zinc-300 text-xl">TX</div>
                        )}
                      </Link>
                      <div className="flex flex-col justify-center">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-700 mb-1">{item.materialCode}</p>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-zinc-900 leading-tight mb-2 line-clamp-2">{item.yarnType}</h3>
                        <p className="text-sm font-semibold text-zinc-600 mb-1">Color: <span className="capitalize">{item.selectedColor}</span></p>
                        <p className="text-xs text-zinc-500">₹{item.pricePerMeter}/m</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="sm:col-span-3 flex sm:justify-center items-center">
                      <div className="inline-flex items-center border border-zinc-200 rounded-lg p-1 bg-white">
                        <button 
                          onClick={() => updateQuantity(item._id, item.selectedColor, item.cartQuantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                          disabled={item.cartQuantity <= 1}
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-12 text-center text-sm font-bold text-zinc-900">{item.cartQuantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.selectedColor, item.cartQuantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="sm:col-span-3 flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-3">
                      <p className="text-xl font-serif font-bold text-zinc-900">
                        ₹{(item.pricePerMeter * item.cartQuantity).toLocaleString('en-IN')}
                      </p>
                      <button 
                        onClick={() => removeFromCart(item._id, item.selectedColor)}
                        className="text-[10px] font-bold tracking-widest uppercase text-rose-500 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center sm:px-2">
              <Link to="/collections" className="text-xs font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-900 flex items-center gap-2 transition-colors">
                ← Continue Shopping
              </Link>
              <button 
                onClick={clearCart}
                className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/20 p-6 sm:p-8 sticky top-28">
              <h2 className="text-xl font-serif text-zinc-900 mb-6 font-bold pb-4 border-b border-zinc-100">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm font-medium">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span className="text-zinc-900 font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Tax (5%)</span>
                  <span className="text-zinc-900">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    <span className="text-zinc-900">₹{shipping.toLocaleString('en-IN')}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-zinc-400 leading-tight">
                    Add ₹{(5000 - subtotal).toLocaleString('en-IN')} more to unlock free shipping.
                  </p>
                )}
              </div>

              <div className="border-t border-zinc-100 pt-5 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-zinc-900">Grand Total</span>
                  <span className="text-3xl font-serif font-bold text-emerald-900">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-emerald-900 text-white rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/20 group"
              >
                <span className="text-xs font-bold uppercase tracking-widest">Proceed to Checkout</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-center text-[10px] text-zinc-400 mt-4 font-medium uppercase tracking-widest flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span> Secure SSL Checkout
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
