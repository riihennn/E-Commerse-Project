import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronDown, SlidersHorizontal } from "lucide-react";
import axios from "axios";
import { UserContext } from "../Context/UserContext";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const navigate = useNavigate();
  const { user, cart, setCart, setUser, wishlist, setWishlist } = useContext(UserContext);

  // Load products
  useEffect(() => {
    axios
      .get("https://powell-895j.onrender.com/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories = ["all", "creatine", "whey protein", "preworkout"];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.item && p.item.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case "price-high":
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case "name-az":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-za":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "discount":
        filtered.sort((a, b) => (parseFloat(b.discount) || 0) - (parseFloat(a.discount) || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    return filteredAndSortedProducts.slice(start, end);
  }, [filteredAndSortedProducts, currentPage]);

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

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-az", label: "Name: A-Z" },
    { value: "name-za", label: "Name: Z-A" },
    { value: "discount", label: "Highest Discount" },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h4 className="text-2xl sm:text-4xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-8 bg-[#2eb4ac]"></span>
            All Products
          </h4>

          <div className="flex gap-3 relative">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryMenu(!showCategoryMenu);
                  setShowSortMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-medium">
                  {selectedCategory === "all" ? "All Categories" : selectedCategory}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showCategoryMenu && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryMenu(false);
                        setCurrentPage(1); // reset page
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                        selectedCategory === cat
                          ? "bg-[#2eb4ac] bg-opacity-10 font-semibold"
                          : ""
                      }`}
                    >
                      {cat === "all" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort By */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowCategoryMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">
                  {sortOptions.find((opt) => opt.value === sortBy)?.label || "Sort By"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showSortMenu && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                        setCurrentPage(1); // reset page
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                        sortBy === option.value
                          ? "bg-[#2eb4ac] bg-opacity-10 font-semibold"
                          : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {paginatedProducts.length === 0 ? (
            <p className="text-gray-600 col-span-full text-center py-12">
              No products found matching your filters
            </p>
          ) : (
            paginatedProducts.map((product) => {
              const liked = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  {/* Product Image */}
                  <div className="relative bg-gradient-to-b from-gray-50 to-white p-3 sm:p-4 h-36 sm:h-40 md:h-44">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                      />
                    </button>

                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-28 sm:h-32 md:h-42 object-contain mb-2"
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
            })
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? "bg-[#2eb4ac] text-white border-[#2eb4ac]"
                    : "bg-white border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
