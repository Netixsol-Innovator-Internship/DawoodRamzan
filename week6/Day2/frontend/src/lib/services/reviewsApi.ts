/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";

export const reviewsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Review
    createReview: builder.mutation<
      any,
      { productId: string; rating: number; message: string }
    >({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product", "Review"],
    }),

    // lib/services/reviewsApi.ts
    getAllReviews: builder.query<any[], void>({
      query: () => "/reviews",
      providesTags: ["Review"],
    }),

    // ✅ Get All Reviews for a Product
    getReviewsByProduct: builder.query<any[], string>({
      query: (productId) => `/reviews/product/${productId}`,
      providesTags: ["Review"],
    }),

    // ✅ Get Single Review
    getReviewById: builder.query<any, string>({
      query: (id) => `/reviews/${id}`,
      providesTags: (result, error, id) => [{ type: "Review", id }],
    }),

    // ✅ Delete Review
    deleteReview: builder.mutation<any, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review", "Product"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useGetReviewsByProductQuery,
  useGetReviewByIdQuery,
  useDeleteReviewMutation,
} = reviewsApi;
