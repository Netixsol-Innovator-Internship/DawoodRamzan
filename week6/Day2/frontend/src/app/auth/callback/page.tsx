"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const id = url.searchParams.get("id");
    const role = url.searchParams.get("role");

    if (token && id && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("role", role);

      router.push("/"); // ✅ redirect to dashboard/home
    } else {
      router.push("/login?error=OAuthFailed");
    }
  }, [router]);

  return <p className="text-center mt-10">Completing login...</p>;
}
