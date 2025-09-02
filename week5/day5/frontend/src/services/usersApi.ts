// src/services/usersApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

// 🟢 Define User type (adjust according to your NestJS schema)
export interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  myCars?: string[];
  myBids?: string[];
  wishlist?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/users", // ⚠️ adjust backend URL/port
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users", "Wishlist"],
  endpoints: (builder) => ({
    // ✅ Get all users
    getUsers: builder.query<User[], void>({
      query: () => "/",
      providesTags: ["Users"],
    }),

    // ✅ Get profile (logged in user)
    getProfile: builder.query<User, void>({
      query: () => "/profile",
      providesTags: ["Users"],
    }),

    // ✅ Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // ✅ Update user
    updateUser: builder.mutation<User, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        "Users",
      ],
    }),

    // ✅ Delete user
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ Add to wishlist
    addToWishlist: builder.mutation<User, { id: string; carId: string }>({
      query: ({ id, carId }) => ({
        url: `/${id}/wishlist/${carId}`,
        method: "POST",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // ✅ Remove from wishlist
    removeFromWishlist: builder.mutation<User, { id: string; carId: string }>({
      query: ({ id, carId }) => ({
        url: `/${id}/wishlist/${carId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetUsersQuery,
  useGetProfileQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = usersApi;
