"use client";
import { useLoginMutation } from "@/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/apiSlice";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import router
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter(); // ✅ Initialize router
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log("✅ Login success:", res);

      // Save to Redux
      dispatch(setCredentials(res));

      // Save token in storage
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("id", res?.user?.id || "unknown");

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // ✅ Redirect to homepage after login
      router.push("/");
    } catch (err) {
      console.error("❌ Login failed:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Toggle Buttons */}
      <div className="flex mb-8">
        <Link
          href="/register"
          className="flex-1 py-3 px-6 text-center border border-gray-300 rounded-l-full text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Register
        </Link>
        <div className="flex-1 py-3 px-6 text-center bg-[#4A5AAF] text-white rounded-r-full">
          Login
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-[#4A5AAF] mb-2">Log In</h2>
          <p className="text-gray-600">
            New member?{" "}
            <Link href="/register" className="text-[#4A5AAF] hover:underline">
              Register Here
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#4A5AAF] font-medium">
              Enter Your Email*
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#4A5AAF] font-medium">
              Password*
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-[#4A5AAF] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4A5AAF] hover:bg-[#3d4a94] text-white"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>

          {error && (
            <p className="text-red-500 text-sm">
              Login failed. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
