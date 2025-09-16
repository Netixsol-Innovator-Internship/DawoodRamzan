// lib/services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://backend-production-ff05.up.railway.app", // ✅ NestJS backend
    baseUrl: "https://shop-production-fb38.up.railway.app",
    // baseUrl:"http://localhost:4000",
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // ✅ Added "Users"
  tagTypes: ["Product", "Review", "Cart", "Orders", "Users", "Payments"],
  endpoints: () => ({}), // endpoints are injected later
});
