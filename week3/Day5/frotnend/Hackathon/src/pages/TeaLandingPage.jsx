"use client";
import { useState, useEffect } from "react";
import {
  Award,
  Truck,
  Clock,
  Shield,
  ShoppingCart,
  Search,
} from "lucide-react";
import { getTeas, getCart } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import data from "../data";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TeaLandingPage = ({ onExploreClick }) => {
  const [teasData, setTeasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);

  const navigate = useNavigate();

  // ✅ Fetch teas
  useEffect(() => {
    const fetchTeas = async () => {
      try {
        const { data } = await getTeas();
        setTeasData(data);
      } catch (err) {
        console.error("Failed to fetch teas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeas();
  }, []);

  // ✅ Fetch cart count
  const fetchCartCount = async () => {
    try {
      const res = await getCart();
      const totalItems = res.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartItemCount(totalItems);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchCartCount();
    }
  }, []);

  // ✅ Add tea to cart
  // const handleAddToCart = async (teaId) => {
  //   try {
  //     setCartLoading(teaId);
  //     await addToCart(teaId, 1);
  //     alert("Added to cart ✅");
  //     fetchCartCount();
  //   } catch (err) {
  //     console.error("Failed to add to cart:", err);
  //     alert("Please log in to add items to cart.");
  //   } finally {
  //     setCartLoading(null);
  //   }
  // };

  if (loading) return <p className="text-center py-10">Loading teas...</p>;

  return (
    <div className="bg-white flex flex-col min-h-screen">
      {/* ✅ Header */}
      <Header />

      {/* ✅ Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1507919909716-c8262e491cde"
                alt="Various tea leaves"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Every day is unique,
                <br />
                just like our tea
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto lg:mx-0">
                Discover our carefully curated collection of premium teas from
                around the world. Each blend tells a story of tradition,
                quality, and exceptional taste.
              </p>
              <button
                onClick={onExploreClick}
                className="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* ✅ Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-10 text-center">
        <div>
          <Truck className="mx-auto text-green-700 mb-2" size={32} />
          <h3 className="font-bold">Free Shipping</h3>
          <p className="text-gray-600 text-sm">On all orders above $50</p>
        </div>
        <div>
          <Award className="mx-auto text-green-700 mb-2" size={32} />
          <h3 className="font-bold">Premium Quality</h3>
          <p className="text-gray-600 text-sm">Hand-picked tea leaves</p>
        </div>
        <div>
          <Clock className="mx-auto text-green-700 mb-2" size={32} />
          <h3 className="font-bold">Fast Delivery</h3>
          <p className="text-gray-600 text-sm">Get it within 3-5 days</p>
        </div>
        <div>
          <Shield className="mx-auto text-green-700 mb-2" size={32} />
          <h3 className="font-bold">Secure Payment</h3>
          <p className="text-gray-600 text-sm">100% protected checkout</p>
        </div>
      </div>

      {/* ✅ Teas Grid */}
      <div className="flex-grow p-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Teas</h2>
        {data.length === 0 ? (
          <p className="text-center text-gray-600">No teas available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {data.map((tea, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col cursor-pointer"
                onClick={() => navigate(`/collections/${tea.collection}`)} // ✅ go to collection page
              >
                <img
                  src={tea.image}
                  alt={tea.collection}
                  className="h-48 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold text-lg text-center">
                  {tea.collection}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default TeaLandingPage;
