import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
});

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('shopping_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to local storage whenever cart items change
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, color = 'Standard') => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(
        item => item._id === product._id && item.selectedColor === color
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const newItems = [...prev];
        newItems[existingItemIndex].cartQuantity += quantity;
        return newItems;
      } else {
        // Add new item
        return [...prev, { ...product, cartQuantity: quantity, selectedColor: color }];
      }
    });
  };

  const removeFromCart = (productId, color) => {
    setCartItems(prev => prev.filter(item => 
      !(item._id === productId && item.selectedColor === color)
    ));
  };

  const updateQuantity = (productId, color, newQuantity) => {
    if (newQuantity < 1) return; // Must have at least 1, or rely on removeFromCart
    
    setCartItems(prev => prev.map(item => {
      if (item._id === productId && item.selectedColor === color) {
        // Ensure they don't exceed stock
        const validQty = Math.min(newQuantity, item.stock || 999);
        return { ...item, cartQuantity: validQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.pricePerMeter * item.cartQuantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.cartQuantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
