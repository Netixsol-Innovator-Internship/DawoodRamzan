// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dawood-week3day5backend.vercel.app/api", // ✅ backend base URL
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // auth
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Tea"], // ✅ added Tea
  endpoints: (builder) => ({
    // -------- AUTH --------
    signup: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // -------- USERS --------
    getUsers: builder.query({
      query: () => "/auth/all-users",
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/auth/update-user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // -------- TEAS --------
    getTeas: builder.query({
      query: () => "/teas",
      providesTags: ["Tea"],
    }),
    createTea: builder.mutation({
      query: (data) => ({
        url: "/teas",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tea"],
    }),
    updateTea: builder.mutation({
      query: ({ id, data }) => ({
        url: `/teas/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tea"],
    }),
    deleteTea: builder.mutation({
      query: (id) => ({
        url: `/teas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tea"],
    }),
  }),
});

export const {
  // auth
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  // users
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  // teas
  useGetTeasQuery,
  useCreateTeaMutation,
  useUpdateTeaMutation,
  useDeleteTeaMutation,
} = apiSlice;
