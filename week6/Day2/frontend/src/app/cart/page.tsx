/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  CartItem as OriginalCartItem,
} from "@/lib/services/cartApi";
import { useCreateOrderMutation } from "@/lib/services/ordersApi";
import { useUpdateProductMutation } from "@/lib/services/productsApi";
import { useGetUserByIdQuery } from "@/lib/services/usersApi"; // ✅ import user API

// Extend CartItem to include salePrice + points
interface CartItem extends OriginalCartItem {
  salePrice?: number;
  point?: number;
}

export default function CartPage() {
  // Example: You should replace with actual logged-in userId (from auth/session)

  const userId = localStorage.getItem("id");
  console.log(userId);
  // Cart API
  const { data: cartData, isLoading, isError } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveFromCartMutation();

  // Order API
  const [createOrder] = useCreateOrderMutation();

  // Product API
  const [updateProduct] = useUpdateProductMutation();

  // User API (✅ fetch points from backend)
  const {
    data: user,
    refetch: refetchUser,
    isFetching: isUserLoading,
  } = useGetUserByIdQuery(userId as string, {
    skip: !userId,
  });

  // Promo state
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Local cart state
  const [cart, setCart] = useState<CartItem[]>(cartData?.items || []);

  // Checkout modal state
  const [checkoutItem, setCheckoutItem] = useState<CartItem | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"money" | "points">(
    "money"
  );

  // Sync local cart with backend
  useEffect(() => {
    if (cartData) {
      setCart(cartData.items);
    }
  }, [cartData]);

  // --- Cart updates ---
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await removeCartItem(itemId).unwrap();
        setCart((prev) => prev.filter((item) => item._id !== itemId));
      } else {
        await updateCartItem({ itemId, quantity: newQuantity }).unwrap();
        setCart((prev) =>
          prev.map((item) =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to update cart item:", err);
      alert("Failed to update cart. Please try again.");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId).unwrap();
      setCart((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      alert("Failed to remove item. Please try again.");
    }
  };

  // --- Apply Promo Code ---
  const handleApplyPromo = async () => {
    if (promoCode.toUpperCase() !== "DISCOUNT25") {
      alert("Invalid promo code ❌");
      return;
    }

    if (!cartData || promoApplied) return;

    try {
      const updatedCart = await Promise.all(
        cartData.items.map(async (item: CartItem) => {
          const discountedPrice = Math.round(item.price * 0.75);

          await updateProduct({
            id: item.productId,
            body: {
              salePrice: discountedPrice,
              $inc: { stockQuantity: -item.quantity }, // subtract stock
            },
          }).unwrap();

          return { ...item, salePrice: discountedPrice };
        })
      );

      setCart(updatedCart);
      setPromoApplied(true);
      alert("Promo code applied successfully! 🎉");
    } catch (err) {
      console.error("Failed to apply promo code:", err);
      alert("Failed to apply promo code. Please try again.");
    }
  };

  // --- Checkout Single Item ---
  const handleOpenCheckout = (item: CartItem) => {
    setCheckoutItem(item);
    setSelectedMethod(item.price ? "money" : "points");
  };

  const handlePlaceOrder = async () => {
    if (!checkoutItem) return;
    if (!customerName || !shippingAddress) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const totalPointsNeeded =
        (checkoutItem.point || 0) * checkoutItem.quantity;

      // ✅ If paying with points
      if (selectedMethod === "points") {
        if ((user?.points || 0) < totalPointsNeeded) {
          alert("Not enough points ❌");
          return;
        }
      }

      // ✅ Place order
      await createOrder({
        shippingAddress,
      }).unwrap();

      // ✅ Remove only this item from the cart
      await removeCartItem(checkoutItem._id).unwrap();
      setCart((prev) => prev.filter((item) => item._id !== checkoutItem._id));

      // ✅ Refetch user points after order
      await refetchUser();

      alert("Order placed successfully! 🎉");

      // Reset modal state
      setCheckoutItem(null);
      setCustomerName("");
      setShippingAddress("");
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-600">
        Loading cart...
      </div>
    );
  }

  if (isError || !cartData || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-500">
        Failed to load cart.
      </div>
    );
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const moneyItems = cart.filter((i) => i.price);
  const pointItems = cart.filter((i) => i.point && !i.price);

  const cartTotal = moneyItems.reduce((sum, item) => {
    const priceToUse =
      item.salePrice && promoApplied ? item.salePrice : item.price;
    return sum + priceToUse * item.quantity;
  }, 0);

  const totalPoints = pointItems.reduce(
    (sum, item) => sum + (item.point || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Cart</span>
      </nav>

      <h1 className="text-3xl font-bold text-black mb-4">YOUR CART</h1>

      {/* ✅ Show user's current points */}
      <p className="mb-8 text-lg font-medium text-gray-700">
        Your Points: <span className="font-bold">{user.points ?? 0} pts</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            cart.map((item: CartItem) => {
              const priceToUse =
                item.salePrice && promoApplied ? item.salePrice : item.price;

              return (
                <div
                  key={item._id}
                  className="flex items-center space-x-4 p-6 border border-gray-200 rounded-lg"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-black mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Size: {item.size}
                    </p>

                    {item.price && (
                      <p className="text-xl font-bold text-black">
                        ${priceToUse * item.quantity}
                      </p>
                    )}
                    {item.point && (
                      <p className="text-xl font-bold text-black">
                        {item.point * item.quantity} pts
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-full">
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenCheckout(item)}
                    className="ml-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Checkout
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items</span>
              <span className="font-medium text-black">{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Money Total</span>
              <span className="font-medium text-black">${cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Points Total</span>
              <span className="font-medium text-black">{totalPoints} pts</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                disabled={promoApplied}
              />
              <button
                onClick={handleApplyPromo}
                className={`bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors ${
                  promoApplied ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={promoApplied}
              >
                {promoApplied ? "Applied" : "Apply"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setCheckoutItem(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-4">Checkout Item</h2>

            <p className="font-medium mb-2">{checkoutItem.name}</p>

            {/* Payment Method Selection */}
            {checkoutItem.price && checkoutItem.point ? (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Choose payment method:
                </p>
                <div className="flex gap-4">
                  <button
                    className={`px-3 py-1 rounded-lg border ${
                      selectedMethod === "money"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => setSelectedMethod("money")}
                  >
                    ${checkoutItem.price} each
                  </button>
                  <button
                    className={`px-3 py-1 rounded-lg border ${
                      selectedMethod === "points"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => setSelectedMethod("points")}
                  >
                    {checkoutItem.point} pts each
                  </button>
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <textarea
                placeholder="Shipping Address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
