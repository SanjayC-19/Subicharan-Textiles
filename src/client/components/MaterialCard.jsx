import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function MaterialCard({ material }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleBuy = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate(`/order/${material._id}`);
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
      
      <button
        type="button"
        onClick={handleBuy}
        className="w-full flex items-center justify-center gap-2 bg-zinc-50 hover:bg-emerald-600 text-zinc-700 hover:text-white py-4 text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white border-t border-zinc-100 group-hover:border-emerald-600"
      >
        <ShoppingBag size={14} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
        <span>Place Order</span>
        <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
      </button>
    </div>
  );
}