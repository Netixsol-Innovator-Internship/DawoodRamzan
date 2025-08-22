// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dawood-week3day5backend.vercel.app/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Tea", "Cart"], // added Cart
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

    getTeaById: builder.query({
      query: (id) => `/teas/${id}`,
      providesTags: (result, error, id) => [{ type: "Tea", id }],
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

    // -------- CART --------
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (data) => ({
        url: "/cart/remove",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartQuantity: builder.mutation({
      query: (data) => ({
        url: "/cart/update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
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
  useGetTeaByIdQuery,
  useCreateTeaMutation,
  useUpdateTeaMutation,
  useDeleteTeaMutation,
  // cart
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
} = apiSlice;
