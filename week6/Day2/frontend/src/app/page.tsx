/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useGetProductsQuery } from "@/lib/services/productsApi"; // ✅ RTK Query
import ProductCard from "@/components/ProductCard";
import ReviewsSlider from "@/components/ReviewsSlider";

export default function HomePage() {
  // Fetch 4 products for New Arrivals
  const {
    data: newArrivals,
    isLoading: isNewArrivalsLoading,
    error: newArrivalsError,
  } = useGetProductsQuery({ page: 1, limit: 4 });
  // console.log(newArrivals?.products);

  // Fetch 4 products for Top Selling
  const {
    data: topSelling,
    isLoading: isTopSellingLoading,
    error: topSellingError,
  } = useGetProductsQuery({ page: 1, limit: 4 });

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Hero Section */}
      <section className="bg-[#F2F0F1]">
        <div className="px-4 sm:px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-black mb-6 integralCF">
                FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
              </h1>
              <p className="w-[545px] text-[#00000099] text-lg mb-8 leading-relaxed">
                Browse through our diverse range of meticulously crafted
                garments, designed to bring out your individuality and cater to
                your sense of style.
              </p>
              <Link
                href="/casual/casual"
                className="inline-block bg-black text-white px-16 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </Link>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-black">200+</div>
                  <div className="text-gray-600">International Brands</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">2,000+</div>
                  <div className="text-gray-600">High-Quality Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">30,000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/hero.jpg"
                alt="Fashion couple"
                className="rounded-lg object-cover"
              />
              <img
                src="/star.svg"
                className="absolute top-25 right-6 w-24 h-24 text-black"
              />
              <img
                src="/star.svg"
                className="absolute top-70 left-2 w-14 h-14 text-black"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="bg-black py-8">
        <div className="px-4 sm:px-6 lg:px-24">
          <div className="flex items-center justify-center md:justify-between flex-wrap gap-8">
            <img src="/icons/versace-logo.svg" alt="Versace" className="h-8" />
            <img src="/icons/zara-logo.svg" alt="Zara" className="h-8" />
            <img src="/icons/gucci-logo.svg" alt="Gucci" className="h-8" />
            <img src="/icons/prada-logo.svg" alt="Prada" className="h-8" />
            <img
              src="/icons/calvin-klein-logo.svg"
              alt="Calvin Klein"
              className="h-8"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            NEW ARRIVALS
          </h2>

          {isNewArrivalsLoading ? (
            <p className="text-center">Loading...</p>
          ) : newArrivalsError ? (
            <p className="text-center text-red-500">Failed to load products</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals?.products?.map((product) => (
                <ProductCard
                  key={product._id}
                  _id={product._id}
                  name={product.name}
                  image={product.images}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  rating={product.rating || 0}
                  reviewCount={product.reviewCount || 0}
                  discount={product.discount}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/new-arrivals"
              className="inline-block border border-gray-300 text-black px-16 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Top Selling */}
      <section className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            TOP SELLING
          </h2>

          {isTopSellingLoading ? (
            <p className="text-center">Loading...</p>
          ) : topSellingError ? (
            <p className="text-center text-red-500">Failed to load products</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {topSelling?.products?.map((product) => (
                <ProductCard
                  key={product._id}
                  _id={product._id}
                  name={product.name}
                  image={product.images}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  rating={product.rating || 0}
                  reviewCount={product.reviewCount || 0}
                  discount={product.discount}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/top-selling"
              className="inline-block border border-gray-300 text-black px-16 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Style */}
      <section className="relative max-w-[1260px] mx-auto bg-[#F0F0F0] rounded-4xl py-14 md:py-16 px-4 sm:px-6 lg:px-16">
        <h2 className="text-center uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-12">
          Browse By Dress Style
        </h2>

        <div className="grid grid-cols-12 gap-6 md:gap-7">
          {/* Casual */}
          <Link
            href="/casual/casual"
            className="group relative col-span-12 md:col-span-4 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
          >
            <img
              src="/browse/casual.png"
              alt="Casual"
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="relative z-10 p-6 flex items-start">
              <h3 className="text-2xl md:text-3xl font-semibold satoshi">
                Casual
              </h3>
            </div>
          </Link>

          {/* Formal */}
          <Link
            href="/casual/formal"
            className="group relative col-span-12 md:col-span-8 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
          >
            <img
              src="/browse/formal.png"
              alt="Formal"
              className="absolute inset-0 w-full h-full object-cover object-[20%_center] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="relative z-10 p-6 flex items-start">
              <h3 className="text-2xl md:text-3xl font-semibold satoshi">
                Formal
              </h3>
            </div>
          </Link>

          {/* Party */}
          <Link
            href="/casual/party"
            className="group relative col-span-12 md:col-span-8 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
          >
            <img
              src="/browse/party.png"
              alt="Party"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="relative z-10 p-6 flex items-start">
              <h3 className="text-2xl md:text-3xl font-semibold satoshi">
                Party
              </h3>
            </div>
          </Link>

          {/* Gym */}
          <Link
            href="/casual/gym"
            className="group relative col-span-12 md:col-span-4 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
          >
            <img
              src="/browse/gym.png"
              alt="Gym"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="relative z-10 p-6 flex items-start">
              <h3 className="text-2xl md:text-3xl font-semibold satoshi">
                Gym
              </h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSlider />
    </div>
  );
}
