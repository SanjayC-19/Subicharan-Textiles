import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ChevronDown, ChevronUp, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const shipping = subtotal >= 2000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <main className="pt-24 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <ShoppingBag size={48} strokeWidth={1} className="mx-auto text-muted-foreground/30 mb-6" />
          <h2 className="font-serif text-3xl text-foreground mb-3">Your bag is empty.</h2>
          <p className="font-sans text-sm text-muted-foreground mb-8">Discover our handcrafted collections and find something beautiful.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans text-[11px] tracking-[0.15em] uppercase px-8 py-4 hover:bg-primary/85 transition-colors">
            Browse Products <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10 flex items-center justify-between">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">Your Bag <span className="text-muted-foreground/40 ml-2">({cartItems.length})</span></h1>
          <button onClick={clearCart} className="font-sans text-[11px] tracking-[0.1em] uppercase text-muted-foreground hover:text-destructive transition-colors border-b border-transparent hover:border-destructive pb-0.5">
            Clear all
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12 grid lg:grid-cols-3 gap-14">
        {/* Items */}
        <div className="lg:col-span-2 divide-y divide-border">
          {cartItems.map(item => (
            <div key={item.id} className="flex gap-5 py-7">
              <div className="w-20 h-28 shrink-0 overflow-hidden bg-muted">
                <img
                  src={item.imageURL || item.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&q=80'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&q=80'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-secondary">{item.category}</span>
                    <h3 className="font-serif text-base text-foreground mt-0.5 line-clamp-2">{item.name}</h3>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 size={15} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-border">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted">
                      <ChevronDown size={14} strokeWidth={1.5} />
                    </button>
                    <span className="w-8 text-center font-sans text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted">
                      <ChevronUp size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                  <span className="font-sans text-sm font-semibold text-foreground">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-muted p-8 sticky top-28">
            <h2 className="font-serif text-xl text-foreground mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm font-sans">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-secondary">Free</span> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (5%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-foreground text-base">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            {shipping > 0 && (
              <p className="font-sans text-xs text-secondary mt-4">
                Add ₹{(2000 - subtotal).toLocaleString('en-IN')} more for free shipping.
              </p>
            )}
            <Link to="/checkout" className="block w-full text-center bg-primary text-primary-foreground font-sans text-[11px] tracking-[0.15em] uppercase py-4 mt-6 hover:bg-primary/85 transition-colors">
              Proceed to Checkout
            </Link>
            <Link to="/products" className="block w-full text-center font-sans text-[11px] tracking-[0.1em] uppercase text-muted-foreground mt-3 hover:text-primary transition-colors py-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
