import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-gray-100 gap-6">
      {/* Product Image */}
      <Link to={`/product/${item.id}`} className="w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
        <img 
          src={item.imageURL} 
          alt={item.name} 
          className="w-full h-full object-cover object-center"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-primary-600 mb-1 font-medium">{item.category}</p>
              <Link to={`/product/${item.id}`}>
                <h3 className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </Link>
            </div>
            <p className="text-lg font-bold text-gray-900 ml-4">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{formatPrice(item.price)} each</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-200 rounded-md">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-3 py-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors disabled:opacity-50"
              disabled={item.quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="px-4 py-1.5 text-gray-900 font-medium min-w-[3rem] text-center border-x border-gray-200">
              {item.quantity}
            </span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-3 py-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Remove Button */}
          <button 
            onClick={() => removeFromCart(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors flex items-center text-sm font-medium"
          >
            <Trash2 size={18} className="mr-1.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
