import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  /** ----------------- USER STATE ----------------- **/
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return null;
    }
  });

  /** ----------------- CART STATE ----------------- **/
  const [cart, setCart] = useState([]);

  /** ----------------- WISHLIST STATE ----------------- **/
  const [wishlist, setWishlist] = useState([]);

  /** ----------------- LOAD USER DATA ON LOGIN ----------------- **/
  useEffect(() => {
    if (!user?.id) {
      // User logged out - clear cart and wishlist
      setCart([]);
      setWishlist([]);
      return;
    }

    // User logged in - fetch their data from DB
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`https://powell-895j.onrender.com/users/${user.id}`);
        setCart(res.data.cart || []);
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.error("Failed to fetch user data from DB", err);
        // Fallback to empty arrays
        setCart([]);
        setWishlist([]);
      }
    };

    fetchUserData();
  }, [user?.id]);

  /** ----------------- SYNC TO LOCALSTORAGE & DB WHEN CART/WISHLIST CHANGES ----------------- **/
  useEffect(() => {
    if (!user?.id) return;

    // Save to localStorage
    try {
      localStorage.setItem("user", JSON.stringify({ ...user, wishlist }));
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save to localStorage", err);
    }

    // Debounced DB update
    const timer = setTimeout(() => {
      axios
        .patch(`https://powell-895j.onrender.com/users/${user.id}`, {
          cart,
          wishlist
        })
        .then(() => console.log("Synced user data with DB"))
        .catch((err) => console.error("Failed to update user in DB", err));
    }, 500);

    return () => clearTimeout(timer);
  }, [user, wishlist, cart]);

  /** ----------------- WISHLIST HELPERS ----------------- **/
  const addToWishlist = (item) => {
    if (!user) {
      alert("Please login to add items to wishlist");
      return;
    }
    setWishlist((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const clearWishlist = () => setWishlist([]);

  /** ----------------- CART HELPERS ----------------- **/
  const addToCart = (item) => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  /** ----------------- LOGOUT ----------------- **/
  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
  };

  /** ----------------- PROVIDER ----------------- **/
  return (
    <UserContext.Provider
      value={{
        /** USER **/
        user,
        setUser,
        logout,

        /** CART **/
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,

        /** WISHLIST **/
        wishlist,
        setWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};