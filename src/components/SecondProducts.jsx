import { Heart, ChevronRight } from "lucide-react";
import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

export default function SecondProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, cart, setCart, wishlist, setWishlist, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://powell-895j.onrender.com/products");
        setProducts(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Toggle Wishlist
  const toggleWishlist = async (product) => {
    if (!user) return navigate("/auth");

    const exists = wishlist.some((item) => item.id === product.id);
    const updatedWishlist = exists
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updatedWishlist);
    const updatedUser = { ...user, wishlist: updatedWishlist };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    try {
      await axios.patch(`https://powell-895j.onrender.com/users/${user.id}`, {
        wishlist: updatedWishlist,
      });
    } catch (err) {
      console.error("❌ Failed to update wishlist:", err);
    }
  };

  // Add to Cart
  const handleAddToCart = (product) => {
    if (!user) return navigate("/auth");

    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      return exists
        ? prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const displayedProducts = useMemo(() => products.slice(10, 20), [products]);

  if (loading)
    return (
      <div className="w-full max-w-[1200px] bg-white mx-auto my-20 px-6 flex items-center justify-center h-64">
        <p className="text-gray-600 animate-pulse">Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="w-full max-w-[1200px] bg-white mx-auto my-20 px-6 flex items-center justify-center h-64">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    );

  return (
    <div className="w-full bg-[#ececec] py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#2eb4ac]" />
          Frequently Bought Together
        </h2>

        <div className="w-full overflow-x-auto hide-scrollbar">
          <div className="flex gap-6 pb-4 min-w-min">
            {displayedProducts.map((product) => {
              const liked = wishlist.some((item) => item.id === product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 w-[200px] sm:w-[220px] lg:w-[250px] flex-shrink-0 
                             flex flex-col shadow-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  {/* Image Section */}
                  <div className="relative bg-gradient-to-b from-gray-50 to-white p-4 h-36 sm:h-40 flex items-center justify-center">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          liked ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                      />
                    </button>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-28 sm:h-32 md:h-35 object-contain"
                    />
                  </div>

                  {/* Info Section */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {product.subtitle}
                    </p>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-base font-bold text-gray-900">
                        ₹{product.currentPrice}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        {product.discount}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-white border border-gray-300 text-gray-900 font-medium py-2 rounded-md text-xs 
                                 hover:bg-gray-50 active:scale-95 focus:ring-2 focus:ring-[#2eb4ac] transition-transform duration-300"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => navigate(`/productpage/${product.id}`)}
                      className="w-full bg-[#2eb4ac] text-white font-semibold py-2 mt-2 rounded-md text-xs hover:bg-[#26a29a] transition-transform duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-[#4192df] font-semibold hover:text-gray-700 transition-colors"
          >
            See All Products
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
