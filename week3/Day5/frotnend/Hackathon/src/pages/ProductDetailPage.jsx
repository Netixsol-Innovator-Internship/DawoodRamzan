"use client";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Thermometer, Users, Palette } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  useGetTeaByIdQuery,
  useGetTeasQuery,
  useAddToCartMutation,
} from "../features/api/apiSlice";

// fallback images
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

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [popularTeas, setPopularTeas] = useState([]);

  // ✅ Fetch product by ID (RTK Query)
  const {
    data: product,
    isLoading: loadingProduct,
    isError,
  } = useGetTeaByIdQuery(id);

  // ✅ Fetch all teas (RTK Query)
  const { data: allTeas, isLoading: loadingPopular } = useGetTeasQuery();

  // ✅ Add to cart mutation
  const [addToCart] = useAddToCartMutation();

  // Compute popular teas
  useEffect(() => {
    if (allTeas && product) {
      let filteredPopular = allTeas.filter(
        (tea) =>
          tea.collection?.some((c) => product.collection?.includes(c)) &&
          tea._id !== product._id
      );

      // Fallback teas if less than 3
      if (filteredPopular.length < 3) {
        const fallbackTeas = [
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
        ];
        filteredPopular = [...filteredPopular, ...fallbackTeas].slice(0, 3);
      }

      setPopularTeas(filteredPopular);
    }
  }, [allTeas, product]);

  const handleAddToCart = async () => {
    try {
      await addToCart({ teaId: product._id, quantity }).unwrap();
      alert("Item added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart.");
    }
  };

  if (loadingProduct) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  if (isError || !product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={getFallbackImage(product._id)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl text-gray-900">${product.price}</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Bag */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors"
            >
              Add to Bag
            </button>

            {/* Info */}
            {product.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  About this tea
                </h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            )}

            {product.ingredients && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Ingredients
                </h3>
                <p className="text-sm text-gray-600">{product.ingredients}</p>
              </div>
            )}

            {product.brewingInstructions && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Brewing Instructions
                </h3>
                <p className="text-sm text-gray-600">
                  {product.brewingInstructions}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Teas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
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
              <div
                key={tea._id}
                className="group cursor-pointer"
                onClick={() =>
                  tea._id.startsWith("fallback")
                    ? navigate("/")
                    : navigate(`/product/${tea._id}`)
                }
              >
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
                  ${Number(tea.price || 0).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
