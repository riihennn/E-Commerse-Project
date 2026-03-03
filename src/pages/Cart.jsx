import React, { useContext } from "react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { user, cart, setCart } = useContext(UserContext);

  const navigate = useNavigate()

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Prices and totals
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.currentPrice?.replace(/[^0-9.]/g, "") || 0);
    const quantity = item?.quantity || 1;
    const discountPercent = Number(item.discount?.replace(/[^0-9]/g, "") || 0);
    const discountAmount = (price * discountPercent) / 100;
    return sum + (price - discountAmount) * quantity;
  }, 0);

  const taxRate = 0.18;
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + tax;

  if (!user) {
    return (
      <div className="text-center p-10">
        <p className="text-lg font-semibold">Please login to see your cart.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cart.map((item) => {
              const price = Number(item.currentPrice?.replace(/[^0-9.]/g, "") || 0);
              const quantity = item?.quantity || 1;
              const discountPercent = Number(item.discount?.replace(/[^0-9]/g, "") || 0);
              const discountAmount = (price * discountPercent) / 100;
              const itemTotal = (price - discountAmount) * quantity;

              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-center gap-4 w-full md:w-2/3">
                    <img
                      src={item.image || ""}
                      alt={item.title || "Product"}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      {item.subtitle && <p className="text-gray-500">{item.subtitle}</p>}
                      {item.badge && (
                        <span className="text-sm text-white bg-green-500 px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                      <p className="text-gray-600">
                        Price: ₹{price} {discountPercent > 0 && `(Discount: ${discountPercent}%)`}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        Total: ₹{itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="p-2 bg-gray-200 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium">{quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="p-2 bg-gray-200 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 bg-red-500 text-white rounded ml-4"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary / Bill */}
          <div className="w-full lg:w-96 p-4 bg-gray-100 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax (18% GST):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Grand Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <button onClick={()=> navigate("/payment")} className="w-full mt-4 bg-[#2eb4ac] hover:bg-[#28a79a] text-white py-3 rounded-lg font-medium transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ShoppingCart className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        Looks like you haven't added any products to your cart yet.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-[#2eb4ac] hover:bg-[#28a79a] text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
};


export default Cart;
