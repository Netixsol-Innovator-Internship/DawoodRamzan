"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeaById, addToCart, getTeas } from "../services/api";
import { ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Clock, Thermometer, Users, Palette } from "lucide-react";

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

  // simple hash: sum char codes of teaId, then mod by number of fallback images
  const hash = teaId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return fallbackImages[hash % fallbackImages.length];
};
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [popularTeas, setPopularTeas] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getTeaById(id);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch popular teas based on collection
  useEffect(() => {
    const fetchPopularTeas = async () => {
      try {
        setLoadingPopular(true);
        const response = await getTeas();

        let filteredPopular = response.data.filter(
          (tea) =>
            tea.collection?.some((c) => product?.collection?.includes(c)) &&
            tea._id !== product?._id
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
      } catch (error) {
        console.error("Error fetching teas:", error);
        setPopularTeas([]);
      } finally {
        setLoadingPopular(false);
      }
    };

    if (product) fetchPopularTeas();
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await addToCart({ teaId: product._id, quantity });
      alert("Item added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  if (!product) {
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

      {/* Info Section Above Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Steeping Instructions */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Steeping Instructions
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shadow">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">SERVING SIZE:</span> 1 tea per
                    cup & 1 tea per pot
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shadow">
                    <Thermometer className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">WATER TEMPERATURE:</span>{" "}
                    100°C
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shadow">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">STEEPING TIME:</span> 3-5
                    minutes
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shadow">
                    <Palette className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">COLOR AFTER 3 MINUTES:</span>{" "}
                    Rich amber
                  </div>
                </div>
              </div>
            </div>

            {/* About This Tea */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                About This Tea
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    FLAVOR
                  </h3>
                  <p className="text-sm text-gray-700">
                    {product.flavor?.join(", ") || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    QUALITIES
                  </h3>
                  <p className="text-sm text-gray-700">
                    {product.quality?.join(", ") || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    CAFFEINE
                  </h3>
                  <p className="text-sm text-gray-700">{product.caffeine}</p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    ALLERGENS
                  </h3>
                  <p className="text-sm text-gray-700">
                    {product.allergens?.join(", ") || "None"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Ingredients
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product.ingredients || "N/A"}
                </p>
              </div>
            </div>
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
                onClick={() => {
                  // Navigate to product if real, else go home
                  if (!tea._id.startsWith("fallback")) {
                    navigate(`/product/${tea._id}`);
                  } else {
                    navigate(`/`);
                  }
                }}
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
