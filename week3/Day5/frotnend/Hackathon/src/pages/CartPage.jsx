"use client";

import { useEffect, useState } from "react";
import { getCart, removeFromCart, placeOrder } from "@/services/api";
import { X } from "lucide-react";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      const res = await getCart();
      if (res.data && res.data.items) {
        setCartItems(
          res.data.items.map((i) => ({
            teaId: i.tea._id,
            name: i.tea.name,
            price: i.tea.price,
            image: i.tea.image,
            quantity: i.quantity,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Remove item from cart
  const handleRemove = async (teaId) => {
    try {
      await removeFromCart({ teaId });
      fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    try {
      await placeOrder();
      alert("✅ Order placed successfully!");
      fetchCart(); // clear cart after placing order
    } catch (err) {
      console.error("Error placing order:", err);
      alert("❌ Failed to place order");
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    fetchCart();
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-gray-700 min-h-screen flex items-center justify-center">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.teaId}
            className="flex items-center gap-4 border-b pb-4"
          >
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="font-medium">{item.name}</h2>
              <p className="text-gray-600">
                £{item.price.toFixed(2)} × {item.quantity}
              </p>
            </div>
            <button
              onClick={() => handleRemove(item.teaId)}
              className="text-gray-500 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: £{totalPrice.toFixed(2)}</p>
        <button
          onClick={handlePlaceOrder}
          className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CartPage;
