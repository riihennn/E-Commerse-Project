import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import { Heart } from "lucide-react";
import { UserContext } from "../Context/UserContext";
import axios from "axios";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, cart, setCart, wishlist, setWishlist, setUser } = useContext(UserContext);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);

      axios
        .get("https://powell-895j.onrender.com/products")
        .then((res) => {
          const filtered = res.data.filter(
            (product) =>
              product.title.toLowerCase().includes(query.toLowerCase()) ||
              product.item.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [query]);

  const toggleWishlist = async (product) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const exists = wishlist.some((item) => item.id === product.id);
    const updatedWishlist = exists
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updatedWishlist);
    const updatedUser = { ...user, wishlist: updatedWishlist };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    try {
      await axios.patch(`https://powell-895j.onrender.com/users/${user.id}`, { wishlist: updatedWishlist });
    } catch (err) {
      console.error("Failed to update wishlist in DB:", err);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    const updatedCart = existingItem
      ? cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...cart, { ...product, quantity: 1 }];

    setCart(updatedCart);
  };

  const wishlistIds = useMemo(() => new Set(wishlist.map((item) => item.id)), [wishlist]);
  const isInWishlist = (productId) => wishlistIds.has(productId);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">
        Search Results for:{" "}
        <span className="text-blue-600 capitalize">{query}</span>
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
  {results.map((product) => {
    const liked = isInWishlist(product.id);

    return (
      <div
        key={product.id}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
      >
        {/* Product Image */}
        <div className="relative bg-gradient-to-b from-gray-50 to-white p-3 sm:p-4 h-44 sm:h-48 md:h-48">
          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 ${
                liked ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>

          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">
            {product.subtitle}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-1 sm:gap-1.5 mb-3 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              ₹{product.currentPrice}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
            <span className="text-xs font-semibold text-green-600">
              {product.discount}
            </span>
          </div>

          {/* Buttons */}
          <div className="space-y-2 mt-auto">
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-white border border-gray-300 text-gray-900 font-medium py-2 rounded-md text-xs 
                hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2eb4ac] 
                focus:ring-offset-2 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate(`/productpage/${product.id}`)}
              className="w-full bg-[#2eb4ac] text-gray-900 font-bold py-2 rounded-md text-xs hover:bg-[#128e86] transition-colors"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>

      ) : (
        <p className="text-gray-600">No products found for "{query}"</p>
      )}
    </div>
  );
}
