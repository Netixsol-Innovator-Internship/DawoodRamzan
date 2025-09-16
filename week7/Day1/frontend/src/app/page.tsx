"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoginForm from "@/components/Auth/LoginForm";
import RegisterForm from "@/components/Auth/RegisterForm";
import Dashboard from "@/components/Dashboard/Dashboard";
import { RootState } from "@/lib/store";
import { setCredentials, logout } from "@/lib/slices/authSlice";

export default function Home() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  // ✅ Hydrate from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      if (parsed.user && parsed.token) {
        dispatch(setCredentials(parsed));
      }
    }
  }, [dispatch]);

  // ✅ Persist auth state when it changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem("auth");
    }
  }, [user, token]);

  const isAuthenticated = !!user && !!token;

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 flex flex-col items-center">
        <button
          onClick={() => dispatch(logout())}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
        >
          Logout
        </button>
        <Dashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      {isLoginMode ? (
        <LoginForm onToggleMode={() => setIsLoginMode(false)} />
      ) : (
        <RegisterForm onToggleMode={() => setIsLoginMode(true)} />
      )}
    </div>
  );
}
