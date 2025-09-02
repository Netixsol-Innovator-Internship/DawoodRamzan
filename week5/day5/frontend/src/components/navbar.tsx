"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  Star,
  Bell,
  Car,
  LogIn,
  LogOut,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/services/store";
import { logout, loadFromStorage } from "@/features/apiSlice";
import { useEffect } from "react";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    console.log("loggedout");
  };

  return (
    <div className="w-full">
      {/* Top Header Bar */}
      <div className="bg-[#4A5AAF] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
              <span className="font-medium">570-694-4002</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>Email Id : info@cardeposit.com</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-orange-400 p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="text-xl font-semibold">
                <span className="text-gray-800">Car </span>
                <span className="text-teal-600">Deposit</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-[#4A5AAF]">
                Home
              </Link>
              <Link
                href="/car-auction"
                className="text-gray-700 hover:text-[#4A5AAF]"
              >
                Car Auction
              </Link>
              <Link
                href="/sell-your-car"
                className="text-gray-700 hover:text-[#4A5AAF]"
              >
                Sell Your Car
              </Link>
              <Link
                href="/auction"
                className="text-gray-700 hover:text-[#4A5AAF]"
              >
                About us
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-[#4A5AAF]"
              >
                Profile
              </Link>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              {/* ✅ Star button goes to /profile/wishlist */}
              <Link href="/profile/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-[#4A5AAF]"
                >
                  <Star className="w-5 h-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-[#4A5AAF]"
              >
                <Bell className="w-5 h-5" />
              </Button>

              {/* ✅ Auth buttons based on state */}
              {token ? (
                <>
                  <span className="text-sm text-gray-700">
                    {user?.username || user?.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-[#4A5AAF]"
                    >
                      <LogIn className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-[#4A5AAF]"
                    >
                      <UserPlus className="w-5 h-5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
