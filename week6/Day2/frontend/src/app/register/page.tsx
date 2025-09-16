"use client";

import { useState, useEffect } from "react";
import { useRegisterMutation } from "../../lib/services/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc"; // Google logo
import { FaGithub, FaDiscord } from "react-icons/fa";
const BACKEND_URL = "https://shop-production-fb38.up.railway.app/auth"; // NestJS backend URL

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/"); // already logged in → go home
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await register(form).unwrap();
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", res.user.role);
      localStorage.setItem("id", res.user.id);
      alert("Registration successful!");
      router.push("/"); // redirect after register
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const handleSocialLogin = (provider: "google" | "github" | "discord") => {
    window.location.href = `${BACKEND_URL}/${provider}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            Registration failed. Please try again.
          </p>
        )}

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-sm text-gray-500">or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social login buttons with icons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-green-800 text-white rounded-xl font-medium hover:bg-green-600 transition"
          >
            <FcGoogle size={22} /> Continue with Google
          </button>

          <button
            onClick={() => handleSocialLogin("github")}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition"
          >
            <FaGithub size={22} /> {/* GitHub logo */}
            Continue with GitHub
          </button>

          <button
            onClick={() => handleSocialLogin("discord")}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            <FaDiscord size={22} /> {/* Discord substitute */}
            Continue with Discord
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-black font-medium hover:underline"
          >
            Click here to login
          </Link>
        </p>
      </div>
    </div>
  );
}
