"use client";

import { useState, useEffect } from "react";
import { useRegisterMutation } from "../../lib/services/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
