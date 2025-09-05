/* eslint-disable @typescript-eslint/no-explicit-any */
// services/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/auth", // NestJS backend URL
  }),
  endpoints: (builder) => ({
    login: builder.mutation<any, LoginDto>({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<any, RegisterDto>({
      query: (body) => ({
        url: "register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
