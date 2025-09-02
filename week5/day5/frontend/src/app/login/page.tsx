"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import LoginForm from "@/components/login-form";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#C8D5F7] to-[#E8F0FF] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A5AAF] mb-4">
            Login
          </h1>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae
            eu eu mus.
          </p>

          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="text-[#4A5AAF] hover:underline">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Login</span>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <LoginForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}
