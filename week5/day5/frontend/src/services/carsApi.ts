/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  vin: string;
  photos: string[];
  description: string;
  currentPrice: number;
  reservePrice: number;
  status: string;
  category: string;
  owner: string;
  auctionEnd: string;
}

export interface CreateCarDto {
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  vin: string;
  photos: string[];
  description: string;
  currentPrice: number;
  reservePrice: number;
  category: string;
  auctionEnd?: string;
}

export interface UpdateCarDto {
  currentPrice?: number;
  status?: string;
  photos?: string[];
}

export const carsApi = createApi({
  reducerPath: "carsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/cars", // adjust
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as any).auth.token || localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Cars"],
  endpoints: (builder) => ({
    getCars: builder.query<Car[], void>({
      query: () => "/",
      providesTags: ["Cars"],
    }),
    getCarById: builder.query<Car, string>({
      query: (id) => `/${id}`,
      providesTags: ["Cars"],
    }),
    searchCars: builder.query<Car[], Record<string, any>>({
      query: (filters) => ({
        url: "/search",
        params: filters,
      }),
      providesTags: ["Cars"],
    }),
    getCarsByUser: builder.query<Car[], string>({
      query: (userId) => `/user/${userId}`,
      providesTags: ["Cars"],
    }),
    createCar: builder.mutation<Car, CreateCarDto>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cars"],
    }),
    updateCar: builder.mutation<Car, { id: string; data: UpdateCarDto }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Cars"],
    }),
    deleteCar: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cars"],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useSearchCarsQuery,
  useGetCarsByUserQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carsApi;
