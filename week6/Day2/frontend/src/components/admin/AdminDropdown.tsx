"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowDown, ArrowRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const AdminDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dummy user (replace with actual user from your auth state / context)
  const user = { firstName: "Admin", lastName: "User" };

  // Handle click outside dropdown
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    // ✅ Clear token from localStorage (or cookies if you’re using cookies)
    localStorage.removeItem("token");

    // (Optional) If using cookies, also expire it like:
    // document.cookie = "token=; Max-Age=0; path=/;";

    // Redirect user to homepage
    router.push("/");

    // Optionally, refresh app state (useful if you’re storing user state globally)
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium font-rubik text-[#1c1c1a] px-4 py-2 border border-solid border-[#1c1c1a] rounded-lg cursor-pointer flex items-center gap-x-2 hover:bg-[#003F62] hover:text-white transition-all duration-300 ease-in-out"
      >
        USER <ArrowDown size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 p-4 rounded-2xl w-[223px] bg-white shadow-lg border border-gray-200 z-50 overflow-hidden">
          {/* User Info */}
          <h4 className="font-rubik font-semibold text-lg text-[#232321]">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : "ADMIN"}
          </h4>

          {/* Change Password */}
          <button className="flex items-center cursor-pointer font-rubik font-medium text-sm text-[#232321] mt-6 whitespace-nowrap">
            CHANGE PASSWORD
            <ArrowRight size={20} className="ml-auto" />
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center cursor-pointer font-rubik font-medium text-sm text-[#232321] mt-6 whitespace-nowrap"
          >
            LOGOUT
            <LogOut size={20} className="ml-auto" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDropdown;
