"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Footer from "@/components/admin/Footer";
import SearchDropdown from "@/components/admin/SearchDropdown";
import AdminDropdown from "@/components/admin/AdminDropdown";
import NotificationDropdown from "@/components/admin/NotificationDropdown";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isShow, setShow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setShow(!isShow);
  };

  useEffect(() => {
    // Scroll to top when layout mounts
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Detect mobile screen
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#e7e7e3] w-full">
      <div className="flex flex-row h-full">
        {/* Sidebar */}
        <div
          style={{
            display: isMobile ? (isShow ? "block" : "none") : "block",
          }}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white shadow-sm">
            <div className="flex items-center md:justify-end justify-between py-2 px-4 h-[70px] border-b border-[#232321]/20">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  className="p-2 rounded-md text-gray-700"
                  onClick={toggleMenu}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
                <div className="hidden sm:block">
                  <SearchDropdown />
                </div>
                <NotificationDropdown />
                <AdminDropdown />
              </div>
            </div>
          </header>

          {/* Main children content */}
          <main className="flex-1 px-6 lg:px-8 py-6">{children}</main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
