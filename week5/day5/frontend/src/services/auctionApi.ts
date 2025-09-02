/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Auction } from "../types/auction"; // We'll define an Auction type

export const auctionsApi = createApi({
  reducerPath: "auctionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/auctions", // Change to your backend URL
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auction"],
  endpoints: (builder) => ({
    getAllAuctions: builder.query<Auction[], void>({
      query: () => "/",
      providesTags: ["Auction"],
    }),
    getActiveAuctions: builder.query<Auction[], void>({
      query: () => "/active",
      providesTags: ["Auction"],
    }),
    getExpiredAuctions: builder.query<Auction[], void>({
      query: () => "/expired",
      providesTags: ["Auction"],
    }),
    getAuctionById: builder.query<Auction, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Auction", id }],
    }),
    getAuctionByCar: builder.query<Auction[], string>({
      query: (carId) => `/car/${carId}`,
      providesTags: ["Auction"],
    }),
    createAuction: builder.mutation<Auction, Partial<Auction>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auction"],
    }),
    updateAuction: builder.mutation<
      Auction,
      { id: string; body: Partial<Auction> }
    >({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Auction", id }],
    }),
    completeAuction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Auction"],
    }),
    deleteAuction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Auction"],
    }),
  }),
});

export const {
  useGetAllAuctionsQuery,
  useGetActiveAuctionsQuery,
  useGetExpiredAuctionsQuery,
  useGetAuctionByIdQuery,
  useGetAuctionByCarQuery,
  useCreateAuctionMutation,
  useUpdateAuctionMutation,
  useCompleteAuctionMutation,
  useDeleteAuctionMutation,
} = auctionsApi;
