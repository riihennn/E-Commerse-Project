import React, { useContext, useState } from "react";
import { X, ShoppingCart, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const EmptyWishlist = ({ navigate }) => (
  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100 backdrop-blur-sm">
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
        <ShoppingCart className="w-16 h-16 text-teal-500" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
        <Sparkles className="w-4 h-4 text-yellow-600" />
      </div>
    </div>

    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
      Your wishlist is empty
    </h2>

    <p className="text-gray-500 text-center mb-8 max-w-md px-4">
      Discover amazing products and save your favorites! Click the heart icon on
      any product to add it here.
    </p>

    <button
      onClick={() => navigate("/")}
      className="group bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
    >
      Start Shopping
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// ✅ Wishlist Items Component (each card has its own "Add to Cart" and "Remove" button)
const WishlistItems = ({ items, onRemove, onAddToCart, removingId }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {items.map((item) => (
      <div
        key={item.id}
        className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
          removingId === item.id ? "scale-95 opacity-50" : "hover:scale-105"
        }`}
      >
        <div className="relative overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="ml-10 w-50 h-50 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button
            onClick={() => onRemove(item.id)}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-100 transition-colors"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-teal-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {item.subtitle || "No description available"}
          </p>

          <div className="flex items-baseline gap-2 mb-4 flex-wrap">
            <span className="text-xl font-bold text-gray-900">
              ₹
              {typeof item.currentPrice === "string"
                ? item.currentPrice
                : item.currentPrice?.toLocaleString("en-IN")}
            </span>
            {item.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹
                {typeof item.originalPrice === "string"
                  ? item.originalPrice
                  : item.originalPrice?.toLocaleString("en-IN")}
              </span>
            )}
            {item.discount && (
              <span className="text-sm font-semibold text-green-600">
                {item.discount}
              </span>
            )}
          </div>

          {/* ✅ Add to Cart Button (individual) */}
          <button
            onClick={() => onAddToCart(item)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    ))}
  </div>
);

const Wishlist = () => {
  const { user, cart, setCart, wishlist, removeFromWishlist } = useContext(UserContext);
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromWishlist(id);
      setRemovingId(null);
    }, 300);
  };

  const handleAddToCart = (item) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const existing = cart.find((i) => i.id === item.id);
    const updatedCart = existing
      ? cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      : [...cart, { ...item, quantity: 1 }];

    setCart(updatedCart);

    // ✅ remove from wishlist after adding to cart
    removeFromWishlist(item.id);
  };

  const totalPrice = wishlist.reduce((acc, item) => {
    const price =
      typeof item.currentPrice === "string"
        ? parseFloat(item.currentPrice.replace(/,/g, ""))
        : item.currentPrice;
    return acc + (price || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <EmptyWishlist navigate={navigate} />
        ) : (
          <>
            <WishlistItems
              items={wishlist}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
              removingId={removingId}
            />

            {/* ✅ Summary Box (optional, shows total price) */}
            <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Total Price ({wishlist.length} items)
                </p>
                <p className="text-3xl font-bold text-black">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
