import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';

export default function MaterialCard({ material }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    addToCart(material, 1, material.color);
    toast.success('Added to Cart', `${material.yarnType || 'Item'} has been added to your cart.`);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/login?redirect=/checkout');
      return;
    }
    // Navigate to checkout with this single item in state, bypassing the cart
    navigate('/checkout', { 
      state: { 
        singleItem: { ...material, cartQuantity: 1, selectedColor: material.color } 
      } 
    });
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white border border-zinc-200/60 overflow-hidden hover:border-emerald-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 min-h-[320px] rounded-xl">
      {material.imageURL ? (
        <div className="w-full h-48 sm:h-56 overflow-hidden bg-zinc-100 border-b border-zinc-100">
          <img 
            src={material.imageURL} 
            alt={material.materialCode} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-full h-48 sm:h-56 bg-zinc-100 flex items-center justify-center border-b border-zinc-100">
           <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">No Image</p>
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600/80">{material.materialCode}</p>
            <h3 className="text-lg font-serif text-zinc-900 leading-tight line-clamp-2" title={material.description}>{material.description || material.yarnType}</h3>
          </div>
          <div className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full flex items-center shrink-0 ml-2">
            <span 
              className="w-2 h-2 rounded-full mr-2 shadow-inner border border-zinc-200" 
              style={{ backgroundColor: material.color.toLowerCase() === 'white' ? '#f8fafc' : material.color.toLowerCase() }}
            ></span>
            <span className="text-xs font-medium text-zinc-600 capitalize">{material.color}</span>
          </div>
        </div>
        
        <div className="py-4 border-t border-b border-zinc-100/50 my-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Stock Available</p>
              <p className="text-sm font-medium text-zinc-700">{material.stock.toLocaleString()} m</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Price</p>
              <p className="text-sm font-bold text-zinc-900">₹{material.pricePerMeter}<span className="text-zinc-400 text-xs font-normal">/m</span></p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex border-t border-zinc-100">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-zinc-50 hover:bg-emerald-50 text-emerald-700 py-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors border-r border-zinc-100"
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
        <button
          type="button"
          onClick={handleBuy}
          className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors"
        >
          <ShoppingBag size={16} />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}