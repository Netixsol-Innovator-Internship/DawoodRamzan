/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Bid {
  _id: string;
  auction: string;
  bidder: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBidDto {
  auction: string;
  amount: number;
}

export const bidsApi = createApi({
  reducerPath: "bidsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000", // ⬅️ replace with your NestJS backend URL
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Bids"],
  endpoints: (builder) => ({
    // ✅ Create a new bid
    createBid: builder.mutation<Bid, CreateBidDto>({
      query: (body) => ({
        url: "/bids",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bids"],
    }),

    // ✅ Get all bids
    getBids: builder.query<Bid[], void>({
      query: () => "/bids",
      providesTags: ["Bids"],
    }),

    // ✅ Get bid by ID
    getBidById: builder.query<Bid, string>({
      query: (id) => `/bids/${id}`,
      providesTags: ["Bids"],
    }),

    // ✅ Get bids by auction
    getBidsByAuction: builder.query<Bid[], string>({
      query: (auctionId) => `/bids/auction/${auctionId}`,
      providesTags: ["Bids"],
    }),

    // ✅ Get bids by user
    getBidsByUser: builder.query<Bid[], string>({
      query: (userId) => `/bids/user/${userId}`,
      providesTags: ["Bids"],
    }),

    // ✅ Get highest bid for an auction
    getHighestBid: builder.query<Bid, string>({
      query: (auctionId) => `/bids/highest/${auctionId}`,
      providesTags: ["Bids"],
    }),

    // ✅ Delete bid
    deleteBid: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bids/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bids"],
    }),
  }),
});

export const {
  useCreateBidMutation,
  useGetBidsQuery,
  useGetBidByIdQuery,
  useGetBidsByAuctionQuery,
  useGetBidsByUserQuery,
  useGetHighestBidQuery,
  useDeleteBidMutation,
} = bidsApi;
