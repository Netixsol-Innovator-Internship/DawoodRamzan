"use client";

import { useState } from "react";
import { CirclePlus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Title from "@/components/admin/Title";
import ProductCard from "@/components/admin/ProductCard";
import { useGetProductsQuery } from "@/lib/services/productsApi";

export default function AllProduct() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // ✅ Fetch products from API
  const { data, isLoading, error } = useGetProductsQuery({
    page: currentPage,
    limit: productsPerPage,
  });

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  console.log(products);
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Generate page numbers with ellipsis
  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 3;

    pageNumbers.push(1);

    if (currentPage > maxVisiblePages + 1) {
      pageNumbers.push("...");
    }

    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(
      totalPages - 1,
      currentPage + Math.floor(maxVisiblePages / 2)
    );

    if (currentPage <= maxVisiblePages) {
      endPage = Math.min(maxVisiblePages + 1, totalPages - 1);
    } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      startPage = Math.max(totalPages - maxVisiblePages, 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i);
      }
    }

    if (currentPage < totalPages - Math.floor(maxVisiblePages / 2) - 1) {
      pageNumbers.push("...");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) => {
      if (number === "...") {
        return (
          <span key={index} className="px-1 sm:px-2 py-1">
            {number}
          </span>
        );
      }

      return (
        <button
          key={index}
          onClick={() => paginate(Number(number))}
          className={`font-rubik font-medium py-1 px-2 sm:py-2 sm:px-4 rounded-lg mx-0.5 sm:mx-1 flex items-center justify-center cursor-pointer text-sm sm:text-base ${
            currentPage === number
              ? "bg-[#232321] !text-white"
              : "bg-transparent border border-[#232321] text-[#232321]"
          }`}
        >
          {number}
        </button>
      );
    });
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <Title title="All Products" subtitle="Home > All Products" />

        <Link
          href="/account/add-product"
          className="bg-[#232321] rounded-lg py-2 px-4 font-rubik font-medium !text-[#fff] flex items-center gap-x-2 cursor-pointer hover:bg-[#003F62] transition-all duration-300 ease-in-out whitespace-nowrap"
        >
          <CirclePlus size={20} color="#fff" className="me-2" />
          <span className="hidden sm:inline">Add New Product</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Loading / Error / Products */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load products.</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((item, index) => (
              <ProductCard
                key={index}
                id={item._id}
                title={item.name}
                productType={item.productType}
                description={item.description}
                price={item.price}
                image={item.images[0]}
                saleCount={item.saleCount}
                remainingStock={item.stockQuantity}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-8 overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Previous */}
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-transparent border border-[#232321] text-[#232321] cursor-pointer hover:bg-gray-100"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {renderPageNumbers()}

              {/* Next */}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-transparent border border-[#232321] text-[#232321] cursor-pointer hover:bg-gray-100"
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
