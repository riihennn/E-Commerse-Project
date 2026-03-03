import { Heart, ChevronRight } from "lucide-react";
import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

export default function ThirdProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, cart, setCart, wishlist, setWishlist, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    let isMounted = true;

    axios
      .get("https://powell-895j.onrender.com/products")
      .then((response) => {
        if (isMounted) setProducts(response.data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Wishlist toggle
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
      console.error("Failed to update wishlist in DB:", err);
    }
  };

  // Add to Cart
  const handleAddToCart = (product) => {
    if (!user) return navigate("/auth");

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Best Sellers
  const bestSellers = useMemo(
    () => products.filter((p) => p.badge === "Best Seller"),
    [products]
  );

  if (loading)
    return (
      <div className="w-full flex items-center justify-center h-64 text-gray-600">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="w-full flex items-center justify-center h-64 text-red-600 font-semibold">
        Error: {error}
      </div>
    );

  return (
    <div
      className="w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('./popular.jpeg')" }}
    >
      <div className="w-full max-w-[1200px] mx-auto pt-16 pb-10 px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl sm:text-4xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#2eb4ac]" />
          Popular
        </h2>

        <div className="flex gap-2 mb-6">
          <button className="bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg">
            Best Seller
          </button>
        </div>

        {/* Products Section */}
        <div className="w-full overflow-x-auto hide-scrollbar">
          <div className="flex gap-6 pb-4 min-w-min">
            {bestSellers.map((product) => {
              const liked = wishlist.some((item) => item.id === product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-shrink-0 w-[260px] sm:w-[300px] flex flex-col 
                             transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative p-4 bg-gradient-to-b from-gray-50 to-white h-40 flex items-center justify-center">
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
                      className="w-full h-32 sm:h-36 object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 min-h-[2.5rem]">
                      {product.subtitle}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base font-bold text-gray-900">
                        ₹{product.currentPrice}
                      </span>
                      <span className="text-xs line-through text-gray-400">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-xs font-semibold text-green-600">
                        {product.discount}
                      </span>
                    </div>

                    {/* Buttons */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-white border border-gray-300 text-gray-900 font-medium py-2 rounded-md text-xs hover:bg-gray-50 active:scale-95 transition-transform duration-300"
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
            className="flex items-center gap-2 text-[#4192df] font-semibold hover:text-gray-200 transition-colors"
          >
            See All Products
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
