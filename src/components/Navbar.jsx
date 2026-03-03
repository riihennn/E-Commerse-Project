import { useState, useContext, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import Logo from "../assets/prowellBlue.png"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { cart, wishlist, user } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle pressing Enter
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSuggestions([]);
    }
  };

  // Handle clicking search icon
  const handleSearchClick = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSuggestions([]);
    }
  };

  // Fetch suggestions while typing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    fetch("http://localhost:3005/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .filter(
            (p) =>
              p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.item.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 5);
        setSuggestions(filtered);
      })
      .catch((err) => console.error(err));
  }, [searchTerm]);

  {console.log(user)}

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="mx-auto px-3 md:mx-20">
<div className="flex items-center justify-between h-24">
  {/* Mobile menu & Logo */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="md:hidden p-3"
    >
      <Menu className="h-8 w-8" />
    </button>
    <Link to="/" className="flex-shrink-0">
      <img
        className="h-10 md:h-15 lg:h-15 w-auto pr-10"
        src={Logo}
        alt="Prowell"
      />
    </Link>
  </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <Link
                to="/"
                className="text-lg text-gray-700 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-lg text-gray-700 hover:text-gray-900"
              >
                Shop
              </Link>

              {user?.isAdmin && (
                <Link to="/admin">Admin</Link>
              )}
          
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full px-5 py-3 pl-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                onClick={handleSearchClick}
                className="absolute left-4 top-3.5 h-6 w-6 text-gray-400 cursor-pointer"
              />

              {/* Suggestion Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  <ul>
                    {suggestions.map((product) => (
                      <li
                        key={product.id}
                        className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          navigate(
                            `/search?query=${encodeURIComponent(product.title)}`
                          );
                          setSearchTerm("");
                          setSuggestions([]);
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {product.title}
                          </span>
                          {product.price && (
                            <span className="text-sm text-gray-500">
                              ${product.price}
                            </span>
                          )}
                          {product.item && (
                            <span className="text-xs text-gray-400">
                              {product.item}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-3 md:space-x-5">
              {/* Wishlist */}
              <button
                onClick={() => navigate("/WishList")}
                className="relative p-3 hover:bg-gray-100 rounded-full"
              >
                <Heart className="h-8 w-8 text-gray-700" />
                {wishlist.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center"
                    style={{ backgroundColor: "#2eb4ac" }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate("/Cart")}
                className="relative p-3 hover:bg-gray-100 rounded-full"
              >
                <ShoppingCart className="h-8 w-8 text-gray-700" />
                {cart.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center"
                    style={{ backgroundColor: "#2eb4ac" }}
                  >
                    {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                  </span>
                )}
              </button>

              {/* User */}
              <div
                onClick={() => navigate(user ? "/profile" : "/auth")}
                className="hidden md:flex items-center gap-2 cursor-pointer"
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg"
                  style={{ backgroundColor: "#2eb4ac" }}
                >
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : <User className="h-6 w-6" />}
                </div>
                <span className="text-gray-700 font-semibold">
                  {user?.name ? `Hello, ${user.name}` : "Login / Sign Up"}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full px-5 py-3 pl-12 text-base border border-gray-300 rounded-lg"
            />
            <Search
              onClick={handleSearchClick}
              className="absolute left-4 top-3.5 h-6 w-6 text-gray-400 cursor-pointer"
            />

            {/* Mobile Suggestion Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                <ul>
                  {suggestions.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        navigate(
                          `/search?query=${encodeURIComponent(product.title)}`
                        );
                        setSearchTerm("");
                        setSuggestions([]);
                        setIsMenuOpen(false); // close menu on mobile
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {product.title}
                        </span>
                        {product.price && (
                          <span className="text-sm text-gray-500">
                            ${product.price}
                          </span>
                        )}
                        {product.item && (
                          <span className="text-xs text-gray-400">
                            {product.item}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay & Sliding Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile User Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200">
          <div
            onClick={() => {
              navigate(user ? "/profile" : "/auth");
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg shadow-md"
              style={{ backgroundColor: "#2eb4ac" }}
            >
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : <User className="h-6 w-6" />}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg">
                {user?.name || "Guest"}
              </p>
              <p className="text-sm text-gray-500">
                {user ? "View Profile" : "Login / Sign Up"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col mt-6 space-y-4 px-6">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg text-gray-700 hover:text-[#2eb4ac]"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg text-gray-700 hover:text-[#2eb4ac]"
          >
            Shop
          </Link>
          <Link
            to="/Cart"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg text-gray-700 hover:text-[#2eb4ac]"
          >
            Cart
          </Link>
          <Link
            to="/WishList"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg text-gray-700 hover:text-[#2eb4ac]"
          >
            Wishlist
          </Link>
          <Link
            to="/orders"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg text-gray-700 hover:text-[#2eb4ac]"
          >
            Your Orders
          </Link>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 py-4 px-6">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Prowell. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
