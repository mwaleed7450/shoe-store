import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'shoe_store_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // product: { _id, name, price, discountPrice, image, stock }
  function addToCart(product, size = '', quantity = 1) {
    const key = `${product._id}_${size}`;
    const price = product.discountPrice || product.price;

    setCart((prev) => {
      const next = { ...prev };
      if (next[key]) {
        next[key] = { ...next[key], quantity: next[key].quantity + quantity };
      } else {
        next[key] = {
          productId: product._id,
          name: product.name,
          price,
          size,
          image: product.image,
          quantity,
        };
      }
      return next;
    });
  }

  function updateQuantity(key, quantity) {
    setCart((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: { ...prev[key], quantity: Math.max(1, quantity) } };
    });
  }

  function removeFromCart(key) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  const items = Object.entries(cart).map(([key, item]) => ({ key, ...item }));
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
