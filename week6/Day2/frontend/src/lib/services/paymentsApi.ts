// src/lib/services/paymentsApi.ts
import { api } from "./api"; // your baseApi with fetchBaseQuery setup

export interface Payment {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  method: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  orderId: string;
  method: string;
}

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<
      {
        clientSecret: string;
        paymentId: string;
        stripePaymentIntentId: string;
      },
      CreatePaymentDto
    >({
      query: (body) => ({
        url: "/payments",
        method: "POST",
        body,
      }),
    }),

    confirmPayment: builder.mutation<Payment, string>({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/confirm`,
        method: "POST",
      }),
    }),

    getPayments: builder.query<Payment[], void>({
      query: () => "/payments",
    }),

    getPaymentById: builder.query<Payment, string>({
      query: (id) => `/payments/${id}`,
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useConfirmPaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
} = paymentsApi;
