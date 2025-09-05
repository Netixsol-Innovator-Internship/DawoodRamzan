/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useGetProductsQuery } from "@/lib/services/productsApi";

export default function DressStylePage() {
  const params = useParams();
  // Convert param to string safely
  const dressStyleParam = Array.isArray(params.dressStyle)
    ? params.dressStyle[0]
    : params.dressStyle;

  // Helper: format URL param nicely
  const formatDressStyle = (style: string | undefined) => {
    if (!style) return "";
    return style
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const pageTitle = formatDressStyle(dressStyleParam);

  // Filters & pagination state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Most Popular");
  const [page, setPage] = useState<number>(1);
  const limit = 9;

  // Fetch all products from API
  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetProductsQuery({
    page: 1,
    limit: 1000, // Fetch all products to filter client-side
  });

  // Filter products based on dress style and other filters
  const filteredProducts = useMemo(() => {
    if (!productsData?.products) return [];

    let filtered = productsData.products.filter((product: any) => {
      // Filter by dress style (case insensitive)
      if (
        dressStyleParam &&
        product.dressStyle?.toLowerCase() !== dressStyleParam.toLowerCase()
      ) {
        return false;
      }

      // Filter by categories
      if (
        selectedCategories.length > 0 &&
        (!product.category || !selectedCategories.includes(product.category))
      ) {
        return false;
      }

      // Filter by colors
      if (
        selectedColors.length > 0 &&
        (!product.color || !selectedColors.includes(product.color))
      ) {
        return false;
      }

      // Filter by price range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Filter by sizes
      if (
        selectedSizes.length > 0 &&
        (!product.sizes ||
          !product.sizes.some((size: string) => selectedSizes.includes(size)))
      ) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case "Price: Low to High":
        filtered.sort((a: any, b: any) => a.price - b.price);
        break;
      case "Price: High to Low":
        filtered.sort((a: any, b: any) => b.price - a.price);
        break;
      case "Newest":
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      // "Most Popular" is the default
    }

    return filtered;
  }, [
    productsData,
    dressStyleParam,
    selectedCategories,
    selectedColors,
    priceRange,
    selectedSizes,
    sortBy,
  ]);

  // Calculate pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredProducts.slice(startIndex, startIndex + limit);
  }, [filteredProducts, page, limit]);

  const totalPages = Math.ceil(filteredProducts.length / limit);

  // Categories from schema
  const categories = ["T-shirts", "Shorts", "Shirts", "Hoods", "Jeans"];

  // Sizes from schema
  const sizes = [
    "xx-small",
    "x-small",
    "small",
    "medium",
    "large",
    "x-large",
    "xx-large",
    "3x-large",
    "4x-large",
  ];

  // Colors from schema
  const colors = ["White", "Blue", "Green", "Red", "Black", "Grey", "Brown"];

  // Format size for display (capitalize)
  const formatSize = (size: string) => {
    return size
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("-");
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    priceRange,
    selectedCategories,
    selectedSizes,
    selectedColors,
    dressStyleParam,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <span>Home</span>
        <span>/</span>
        <span className="text-black font-medium">{pageTitle}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-black">Filters</h3>
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h4 className="font-medium text-black mb-4 flex items-center justify-between">
                Categories
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => {
                        if (selectedCategories.includes(category)) {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category)
                          );
                        } else {
                          setSelectedCategories([
                            ...selectedCategories,
                            category,
                          ]);
                        }
                      }}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <h4 className="font-medium text-black mb-4 flex items-center justify-between">
                Colors
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      if (selectedColors.includes(color)) {
                        setSelectedColors(
                          selectedColors.filter((c) => c !== color)
                        );
                      } else {
                        setSelectedColors([...selectedColors, color]);
                      }
                    }}
                    className={`px-3 py-2 text-sm border rounded-full transition-colors ${
                      selectedColors.includes(color)
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-700 hover:border-black"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h4 className="font-medium text-black mb-4 flex items-center justify-between">
                Price
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <div className="space-y-4">
                <input
                  type="range"
                  min={0}
                  max={10000}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <h4 className="font-medium text-black mb-4 flex items-center justify-between">
                Size
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      if (selectedSizes.includes(size)) {
                        setSelectedSizes(
                          selectedSizes.filter((s) => s !== size)
                        );
                      } else {
                        setSelectedSizes([...selectedSizes, size]);
                      }
                    }}
                    className={`px-3 py-2 text-sm border rounded-full transition-colors ${
                      selectedSizes.includes(size)
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-700 hover:border-black"
                    }`}
                  >
                    {formatSize(size)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setPriceRange([0, 10000]);
                setSelectedCategories([]);
                setSelectedSizes([]);
                setSelectedColors([]);
              }}
              className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors mb-2"
            >
              Apply Filter
            </button>

            <button
              onClick={() => {
                setPriceRange([0, 10000]);
                setSelectedCategories([]);
                setSelectedSizes([]);
                setSelectedColors([]);
              }}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-black mb-2">
                {pageTitle}
              </h1>
              <p className="text-gray-600">
                Showing{" "}
                {paginatedProducts.length > 0 ? (page - 1) * limit + 1 : 0}-
                {(page - 1) * limit + paginatedProducts.length} of{" "}
                {filteredProducts.length} Products
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>Most Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading products...</p>
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">Failed to load products.</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No products found matching your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedProducts.map((p: any) => (
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
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-2 text-gray-600 hover:text-black disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded ${
                          page === pageNum
                            ? "bg-black text-white"
                            : "text-gray-600 hover:text-black"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                    }
                    disabled={page === totalPages}
                    className="px-3 py-2 text-gray-600 hover:text-black disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
