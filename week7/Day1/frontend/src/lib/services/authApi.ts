// lib/services/authApi.ts
import { api } from "../api";

export interface AuthResponse {
  access_token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      AuthResponse,
      { name: string; email: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    googleCallback: builder.query<AuthResponse, void>({
      query: () => "/auth/google/callback",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLazyGoogleCallbackQuery,
} = authApi;
