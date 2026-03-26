import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
// Removed RazorpayButton import

export default function ProductCard({ product, className }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn('group block', className)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-muted aspect-[3/4]">
        <img
          src={product.imageURL || product.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80'; }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-500" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="font-sans text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 bg-background/90 text-foreground">
            {product.category}
          </span>
        </div>

        {/* Quick-action buttons on hover */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase hover:bg-primary/85 transition-colors shadow-lg"
          >
            <ShoppingBag size={13} strokeWidth={1.5} />
            Add to Bag
          </button>
          <button
            onClick={e => { e.preventDefault(); navigate(`/product/${product.id}`); }}
            className="p-2.5 bg-background text-foreground hover:bg-muted transition-colors shadow-lg"
            aria-label="View product"
          >
            <Eye size={15} strokeWidth={1.5} />
          </button>
          {/* RazorpayButton removed */}
              alert('Payment failed!');
            }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="pt-4 pb-2">
        <h3 className="font-serif text-base font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-sans text-sm font-semibold text-primary">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="font-sans text-xs text-muted-foreground line-through">
              ₹{Number(product.originalPrice).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
