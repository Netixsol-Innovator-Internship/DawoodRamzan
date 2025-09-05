// lib/services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000", // ✅ NestJS backend
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
  tagTypes: ["Product", "Review", "Cart", "Orders", "Users"],
  endpoints: () => ({}), // endpoints are injected later
});
