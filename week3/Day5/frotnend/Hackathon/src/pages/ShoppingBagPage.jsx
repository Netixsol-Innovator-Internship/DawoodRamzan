"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useGetTeasQuery,
  useGetCartQuery,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
} from "../features/api/apiSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

const getFallbackImage = (teaId) => {
  const fallbackImages = [
    "/assets/t2.jpg",
    "/assets/t3.jpg",
    "/assets/t4.jpg",
    "/assets/t5.jpg",
    "/assets/t6.jpg",
    "/assets/t7.jpg",
    "/assets/t8.jpg",
  ];
  const hash = teaId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackImages[hash % fallbackImages.length];
};

const ShoppingBagPage = ({ onContinueShopping }) => {
  // ✅ RTK Query hooks
  const {
    data: cartResponse,
    isLoading: loadingCart,
    refetch: refetchCart,
  } = useGetCartQuery();
  const { data: teasResponse, isLoading: loadingPopular } = useGetTeasQuery();

  const [updateCartQuantity] = useUpdateCartQuantityMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const [popularTeas, setPopularTeas] = useState([]);

  // =====================
  // Cart items from backend
  // =====================
  const cartItems = Array.isArray(cartResponse?.data)
    ? cartResponse.data
    : cartResponse?.items || [];

  // =====================
  // Update Cart Quantity
  // =====================
  const handleUpdateQuantity = async (teaId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart({ teaId }).unwrap();
      } else {
        await updateCartQuantity({ teaId, quantity: newQuantity }).unwrap();
      }
      refetchCart(); // refresh cart after update
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // =====================
  // Popular teas logic
  // =====================
  useEffect(() => {
    if (!loadingCart && teasResponse) {
      const teas = teasResponse.data || teasResponse;

      const cartCollections = Array.from(
        new Set(cartItems.map((item) => item.tea.collection))
      );

      const filteredTeas = teas.filter((tea) =>
        cartCollections.includes(tea.collection)
      );

      if (filteredTeas.length === 0) {
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
      } else {
        setPopularTeas(filteredTeas);
      }
    }
  }, [loadingCart, teasResponse, cartItems]);

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
      <Header />

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
                  const tea = item.tea;
                  const teaId = tea._id;
                  const quantity = item.quantity;

                  return (
                    <div
                      key={teaId}
                      className="flex items-center space-x-4 pb-6 border-b border-gray-200"
                    >
                      <img
                        src={getFallbackImage(tea._id)}
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
                      src={getFallbackImage(tea._id)}
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
