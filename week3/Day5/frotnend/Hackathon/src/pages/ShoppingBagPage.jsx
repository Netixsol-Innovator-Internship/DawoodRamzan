"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import {
  getTeas,
  getCart,
  updateCartQuantity as updateCartAPI,
  removeFromCart,
} from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ShoppingBagPage = ({ onContinueShopping }) => {
  const [cartItems, setCartItems] = useState([]);
  const [popularTeas, setPopularTeas] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);

  // =====================
  // Fetch Cart from Backend
  // =====================
  const fetchCart = async () => {
    try {
      setLoadingCart(true);
      const response = await getCart();
      const items = Array.isArray(response.data)
        ? response.data
        : response.data.items || [];
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  // =====================
  // Update Cart Quantity
  // =====================
  const handleUpdateQuantity = async (teaId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart({ teaId });
      } else {
        await updateCartAPI({ teaId, quantity: newQuantity });
      }
      await fetchCart(); // Refresh cart after change
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // =====================
  // Fetch Popular Teas
  // =====================
  useEffect(() => {
    const fetchPopularTeas = async () => {
      try {
        setLoadingPopular(true);
        const response = await getTeas();
        setPopularTeas(response.data);
      } catch (error) {
        console.error("Error fetching teas:", error);
        setPopularTeas([
          {
            _id: "fallback-1",
            name: "Hibiscus Berry Blend",
            price: 3.75,
            image: "/hibiscus-berry-tea.png",
          },
          {
            _id: "fallback-2",
            name: "Dragon Well Green Tea",
            price: 5.2,
            image: "/dragon-well-tea.png",
          },
          {
            _id: "fallback-3",
            name: "Earl Grey Supreme",
            price: 4.5,
            image: "/earl-grey-loose-leaf.png",
          },
        ]);
      } finally {
        setLoadingPopular(false);
      }
    };

    fetchPopularTeas();
    fetchCart();
  }, []);

  // =====================
  // Totals
  // =====================
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.tea?.price || 0) * (item.quantity || 0),
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-light text-gray-900 mb-8">My Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {loadingCart ? (
              <div className="text-center py-12 text-gray-500">
                Loading your bag...
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Your bag is empty</p>
                <button
                  onClick={onContinueShopping}
                  className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const tea = item.tea; // populated tea object
                  const teaId = tea._id;
                  const quantity = item.quantity;

                  return (
                    <div
                      key={teaId}
                      className="flex items-center space-x-4 pb-6 border-b border-gray-200"
                    >
                      <img
                        src={tea.image || "/placeholder.svg"}
                        alt={tea.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {tea.name}
                        </h3>
                        <p className="text-gray-600">£{tea.price.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(teaId, quantity - 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-3 text-sm">{quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(teaId, quantity + 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium">
                          £{(tea.price * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors mb-4">
                  Checkout
                </button>

                <button
                  onClick={onContinueShopping}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Popular Tea Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-light text-gray-900 mb-8">
            Popular Tea Selections
          </h2>
          {loadingPopular ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {popularTeas.map((tea) => (
                <div key={tea._id} className="group cursor-pointer">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 group-hover:opacity-75 transition-opacity">
                    <img
                      src={tea.image || "/placeholder.svg"}
                      alt={tea.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {tea.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    £{Number(tea.price || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShoppingBagPage;
