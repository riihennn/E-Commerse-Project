import { Heart, ChevronRight } from "lucide-react";
import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

export default function FirstProducts() {
  const [activeTab, setActiveTab] = useState("Biozyme Range");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, cart, setCart, wishlist, setWishlist, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    axios
      .get("https://powell-895j.onrender.com/products")
      .then((res) => { if (isMounted) setProducts(res.data); })
      .catch((err) => { if (isMounted) setError(err.message); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, []);

  const toggleWishlist = async (product) => {
    if (!user) return navigate("/auth");

    const exists = wishlist.some(item => item.id === product.id);
    const updatedWishlist = exists
      ? wishlist.filter(item => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updatedWishlist);
    const updatedUser = { ...user, wishlist: updatedWishlist };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    try {
      await axios.patch(`https://powell-895j.onrender.com/users/${user.id}`, { wishlist: updatedWishlist });
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) return navigate("/auth");

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const displayedProducts = useMemo(() => products.slice(20, 30), [products]);

  if (loading) return <p className="text-center text-gray-600 py-8">Loading products...</p>;
  if (error) return <p className="text-center text-red-600 py-8">Error: {error}</p>;

  return (
    <div className="w-full max-w-[1200px] mx-auto my-8 px-4 sm:px-6 md:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-6">
        <span className="w-1 h-6 sm:h-8 bg-[#2eb4ac]" />
        In High Demand
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-3 mb-6">
          <button className="bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg">
            PreWork-Out
          </button>

      </div>

      {/* Horizontal Scroll Products */}
      <div className="w-full overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 sm:gap-6 md:gap-8 pb-4 min-w-min px-4 -mx-4">
          {displayedProducts.map(product => {
            const liked = wishlist.some(item => item.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[250px] h-[340px] sm:h-[350px] md:h-[360px] lg:h-[370px] flex flex-col
                           transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative bg-gradient-to-b from-gray-50 to-white p-3 sm:p-4 h-32 sm:h-36 md:h-40 flex items-center justify-center">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  </button>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-28 sm:h-32 md:h-35 object-contain mb-2"
                  />
                  <div className="absolute bottom-2 right-2 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2 sm:p-3 flex-1 flex flex-col">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">{product.subtitle}</p>

                  <div className="flex items-baseline gap-1 sm:gap-1.5 mb-2 sm:mb-3 flex-wrap">
                    <span className="text-sm sm:text-base font-bold text-gray-900">₹{product.currentPrice}</span>
                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-xs font-semibold text-green-600">{product.discount}</span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 mt-auto">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-white border border-gray-300 text-gray-900 font-medium py-2 rounded-md text-xs hover:bg-gray-50 active:scale-95 transition-transform duration-150"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => navigate(`/productpage/${product.id}`)}
                      className="w-full bg-[#2eb4ac] text-white font-semibold py-2 rounded-md text-xs hover:bg-[#26a29a] transition-transform duration-150"
                    >
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-[#4192df] font-semibold hover:text-gray-700 transition-colors duration-200"
        >
          See All Products
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
