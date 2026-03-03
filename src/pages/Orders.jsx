import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import { UserContext } from "../Context/UserContext";

const Orders = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-4">You need to log in to view your orders.</p>
          <button
            onClick={() => navigate("/auth")}
            className="bg-[#2eb4ac] text-white px-6 py-2 rounded-lg hover:bg-[#269e97]"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const orders = user.orders || [];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-7 w-7 text-[#2eb4ac]" />
            Your Orders
          </h1>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No orders yet.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#2eb4ac] text-white px-6 py-3 rounded-lg hover:bg-[#269e97]"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Order #{order.orderId}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{(item.currentPrice * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <p className="text-gray-600">
                    Status:{" "}
                    <span className="font-medium text-[#2eb4ac]">
                      {order.status}
                    </span>
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    Total: ₹{order.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
