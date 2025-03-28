import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (c) => Number(c.bookId) === Number(item.bookId)
      );
      const updatedCart = prevCart.map((c) =>
        Number(c.bookId) === Number(item.bookId)
          ? {
              ...c,
              quantity: c.quantity + item.quantity,
              subtotal: (c.quantity + item.quantity) * c.price,
            }
          : c
      );

      return existingItem ? updatedCart : [...prevCart, item];
    });
  };

  const removeFromCart = (bookId: number) => {
    console.log('Removing book with ID:', bookId);
    setCart((prevCart) => prevCart.filter((c) => c.bookId !== bookId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
