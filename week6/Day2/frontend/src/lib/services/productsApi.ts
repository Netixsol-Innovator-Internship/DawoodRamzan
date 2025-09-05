/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/productsApi.ts
import { api } from "./api";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create product
    createProduct: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    // Get all products (with filters, pagination)
    getProducts: builder.query<
      { products: any[]; total: number },
      {
        category?: string;
        dressStyle?: string;
        minPrice?: number;
        maxPrice?: number;
        size?: string;
        search?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Product"],
    }),

    // Get product by ID
    getProductById: builder.query<any, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Update product
    updateProduct: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    // Delete product
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
