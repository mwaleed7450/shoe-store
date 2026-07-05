import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'shoe_store_wishlist';

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(loadWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  function isWishlisted(productId) {
    return !!wishlist[productId];
  }

  function toggleWishlist(product) {
    setWishlist((prev) => {
      const next = { ...prev };
      if (next[product._id]) delete next[product._id];
      else next[product._id] = product;
      return next;
    });
    return !wishlist[product._id]; // returns true if it was just added
  }

  const items = Object.values(wishlist);

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
