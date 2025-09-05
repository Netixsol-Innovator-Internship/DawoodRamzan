"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FileTextIcon,
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  UsersIcon, // ✅ Added for users
} from "lucide-react";
import { useGetProductsQuery } from "@/lib/services/productsApi"; // ✅ import RTK query

// Mock: replace with your actual user auth hook / context
const useAuth = () => {
  return {
    role: "super-admin", // change this dynamically from your auth system
  };
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const role = localStorage.getItem("role");

  // ✅ Fetch all products (no filters, large limit for full list)
  const { data, isLoading, error } = useGetProductsQuery({
    page: 1,
    limit: 1000,
  });

  // ✅ Group products by category
  const categories = useMemo(() => {
    if (!data?.products) return [];
    const counts: Record<string, number> = {};

    data.products.forEach((p) => {
      const cat = p.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      path: name.toLowerCase().replace(/\s+/g, "-"),
    }));
  }, [data]);

  return (
    <div className="flex flex-col bg-white border-r border-[#232321]/20 min-h-full pt-6 md:px-6 px-4">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        {/* <Image src="/logo.png" alt="logo" width={120} height={40} /> */}
      </div>

      {/* Dashboard */}
      <Link
        href="/account/dashboard"
        className={`flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 font-rubik text-sm font-medium cursor-pointer ${
          pathname === "/account/dashboard"
            ? "bg-[#003F62] px-3 rounded-lg text-white md:w-auto w-[45px] md:h-[50px] h-[45px]"
            : ""
        }`}
      >
        <LayoutDashboardIcon className="min-w-4 w-5" />
        <p className="hidden md:inline-block">DASHBOARD</p>
      </Link>

      {/* All Products */}
      <Link
        href="/account/all-product"
        className={`flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 font-rubik text-sm font-medium cursor-pointer ${
          pathname === "/account/all-product" ||
          pathname.includes("/account/all-product")
            ? "bg-[#003F62] px-3 rounded-lg text-white md:w-auto w-[45px] md:h-[50px] h-[45px]"
            : ""
        }`}
      >
        <GalleryVerticalEndIcon className="min-w-4 w-5" />
        <p className="hidden md:inline-block">ALL PRODUCTS</p>
      </Link>

      {/* Order List */}
      <Link
        href="/account/orderlist"
        className={`flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 font-rubik text-sm font-medium cursor-pointer ${
          pathname === "/account/orderlist" ||
          pathname.includes("/account/orderlist/")
            ? "bg-[#003F62] px-3 rounded-lg text-white md:w-auto w-[45px] md:h-[50px] h-[45px]"
            : ""
        }`}
      >
        <FileTextIcon className="min-w-4 w-5" />
        <p className="hidden md:inline-block">ORDER LIST</p>
      </Link>

      {/* ✅ Users (only visible for super-admin) */}
      {role === "super-admin" && (
        <Link
          href="/account/users"
          className={`flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 font-rubik text-sm font-medium cursor-pointer ${
            pathname === "/account/users"
              ? "bg-[#003F62] px-3 rounded-lg text-white md:w-auto w-[45px] md:h-[50px] h-[45px]"
              : ""
          }`}
        >
          <UsersIcon className="min-w-4 w-5" />
          <p className="hidden md:inline-block">USERS</p>
        </Link>
      )}

      {/* Categories Dropdown */}
      <div className="relative">
        <div
          className="flex items-center justify-between gap-3 py-3.5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="hidden md:inline-block font-rubik text-xl text-[#232321] font-medium cursor-pointer">
            Categories
          </p>
          {isOpen ? (
            <ArrowDownIcon className="min-w-4 w-5 text-[#232321]" />
          ) : (
            <ArrowUpIcon className="min-w-4 w-5 text-[#232321]" />
          )}
        </div>

        {isLoading && (
          <p className="px-2 text-sm text-gray-500">Loading categories...</p>
        )}
        {error && (
          <p className="px-2 text-sm text-red-500">
            Failed to load categories.
          </p>
        )}

        <ul
          className={`absolute top-full left-0 w-full z-10 ${
            isOpen ? "" : "hidden"
          }`}
        >
          {categories.map((category) => {
            const active = pathname.includes(category.path);
            return (
              <li key={category.path} className="cursor-pointer">
                <Link href={`/account/listProduct?category=${category.path}`}>
                  <div className="flex items-center justify-between mb-5">
                    <p className="font-open-sans font-semibold text-base text-[#232321]">
                      {category.name}
                    </p>
                    <span
                      className={`hidden md:inline-flex items-center justify-center w-[41px] h-[35px] p-2 rounded-sm font-open-sans font-semibold text-sm ${
                        active ? "bg-[#003F62] text-white" : "bg-[#e7e7e3]"
                      }`}
                    >
                      {category.count}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
