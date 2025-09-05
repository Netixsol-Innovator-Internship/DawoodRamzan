/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Star, Minus, Plus } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  useGetProductsQuery,
  useGetProductByIdQuery,
} from "@/lib/services/productsApi";
import {
  useGetReviewsByProductQuery,
  useCreateReviewMutation,
} from "@/lib/services/reviewsApi";
import {
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useGetCartItemQuery,
} from "@/lib/services/cartApi"; // ✅ Cart queries & mutations

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");

  // ✅ Fetch related products
  const {
    data: relatedProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useGetProductsQuery({ limit: 4 });

  // ✅ Fetch product by ID
  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useGetProductByIdQuery(params.id);

  console.log(product);
  // ✅ Fetch reviews
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useGetReviewsByProductQuery(params.id);

  // ✅ Create review mutation
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  // ✅ Add to cart + Update cart mutations
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [updateCartItem, { isLoading: isUpdatingCart }] =
    useUpdateCartItemMutation();

  // ✅ Check if item already exists in cart
  const { data: existingCartItem, isFetching: isFetchingCartItem } =
    useGetCartItemQuery(params.id, {
      skip: !params.id,
    });

  // ✅ Review form state
  const [rating, setRating] = useState(5);
  const [message, setComment] = useState("");

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({
        productId: params.id,
        rating,
        message,
      }).unwrap();

      setComment("");
      setRating(5);
      alert("Review submitted successfully ✅");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review ❌");
    }
  };

  const handleAddToCart = async (isLoyalty = false) => {
    if (!product) return;

    // Validate size selection
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }

    try {
      if (existingCartItem) {
        // ✅ If already in cart → update quantity
        await updateCartItem({
          itemId: existingCartItem._id,
          quantity: existingCartItem.quantity + quantity,
        }).unwrap();
        alert("Cart updated successfully 🛒");
      } else {
        // ✅ If not in cart → add new item
        const addToCartData = {
          productId: params.id,
          quantity,
          size: selectedSize || "One Size",
          isLoyalty, // ✅ flag if using loyalty points
        };
        await addToCart(addToCartData).unwrap();
        alert(
          isLoyalty
            ? "Product redeemed with points successfully 🎉"
            : "Product added to cart successfully! 🛒"
        );
      }

      // Reset quantity
      setQuantity(1);
    } catch (error) {
      console.error("Failed to add/update cart:", error);
      alert("Failed to update cart. Stock ended");
    }
  };

  const renderStars = (rating: number, setRatingFn?: (val: number) => void) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        onClick={() => setRatingFn && setRatingFn(i + 1)}
        className={`w-5 h-5 cursor-pointer ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-600">
        Loading product...
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-500">
        Failed to load product ❌
      </div>
    );
  }

  const hasPrice = product.price || product.salePrice > 0;
  const hasPoints = product.point && product.point > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <span>Home</span>
        <span>/</span>
        <span>Shop</span>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <img
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images?.map((image: string, index: number) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg overflow-hidden aspect-square"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-black mb-4">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              {renderStars(product.rating || 0)}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating}/5 ({reviews.length} reviews)
            </span>
          </div>

          {/* Price OR Loyalty Points */}
          <div className="flex items-center space-x-4 mb-6">
            {hasPrice && (
              <>
                <span className="text-3xl font-bold text-black">
                  ${product.salePrice > 0 ? product.salePrice : product.price}
                </span>
                {product.salePrice > 0 && (
                  <span className="text-2xl text-gray-500 line-through">
                    ${product.price}
                  </span>
                )}
                {product.salePrice > 0 && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    SALE
                  </span>
                )}
              </>
            )}
            {hasPoints && (
              <span className="text-2xl font-semibold text-purple-600">
                {product.point} Points
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium text-black mb-3">Choose Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border rounded-full transition-colors ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-700 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-3 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button(s) */}
            {hasPrice && (
              <button
                onClick={() => handleAddToCart(false)}
                disabled={
                  isAddingToCart || isUpdatingCart || isFetchingCartItem
                }
                className="flex-1 bg-black text-white py-4 px-8 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart || isUpdatingCart || isFetchingCartItem
                  ? "Processing..."
                  : existingCartItem
                  ? "Update Cart"
                  : "Add to Cart"}
              </button>
            )}
            {hasPoints && (
              <button
                onClick={() => handleAddToCart(true)}
                disabled={
                  isAddingToCart || isUpdatingCart || isFetchingCartItem
                }
                className="flex-1 bg-purple-600 text-white py-4 px-8 rounded-full font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart || isUpdatingCart || isFetchingCartItem
                  ? "Processing..."
                  : existingCartItem
                  ? "Update Cart (Points)"
                  : "Redeem with Points"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            {["Product Details", "Rating & Reviews", "FAQs"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(
                    tab.toLowerCase().replace(" & ", "-").replace(" ", "-")
                  )
                }
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab ===
                  tab.toLowerCase().replace(" & ", "-").replace(" ", "-")
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Content */}
        {activeTab === "rating-reviews" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-black">
                All Reviews ({reviews.length})
              </h3>
            </div>

            {reviewsLoading && <p>Loading reviews...</p>}
            {reviewsError && (
              <p className="text-red-500">Failed to load reviews.</p>
            )}

            {!reviewsLoading && !reviewsError && reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review: any, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center mb-3">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.rating}/5
                      </span>
                    </div>

                    <div className="flex items-center mb-2">
                      <span className="font-medium text-black mr-2">
                        {review.userId?.username || "Anonymous"}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3 leading-relaxed">
                      {review.message || review.comment}
                    </p>

                    <p className="text-sm text-gray-500">
                      Posted on{" "}
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              !reviewsLoading &&
              !reviewsError && <p className="text-gray-500">No reviews yet.</p>
            )}

            <div className="mt-10 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Your Rating
                  </label>
                  <div className="flex">{renderStars(rating, setRating)}</div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Your Comment
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded-lg p-3 focus:ring focus:ring-black focus:outline-none"
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* You Might Also Like */}
      <section>
        <h2 className="text-3xl font-bold text-center text-black mb-12">
          YOU MIGHT ALSO LIKE
        </h2>
        {isLoadingProducts && (
          <p className="text-center">Loading products...</p>
        )}
        {isErrorProducts && (
          <p className="text-center text-red-500">Failed to load products</p>
        )}
        {!isLoadingProducts &&
          !isErrorProducts &&
          (relatedProducts?.products?.length ?? 0) > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts?.products?.map((p: any) => (
                <ProductCard
                  key={p._id}
                  _id={p._id}
                  name={p.name}
                  image={p.images}
                  price={p.salePrice > 0 ? p.salePrice : p.price}
                  originalPrice={p.salePrice > 0 ? p.price : undefined}
                  rating={p.rating || 0}
                  reviewCount={p.reviewCount || 0}
                  discount={
                    p.salePrice > 0
                      ? Math.round(((p.price - p.salePrice) / p.price) * 100)
                      : undefined
                  }
                  point={p.point}
                />
              ))}
            </div>
          )}
      </section>
    </div>
  );
}
