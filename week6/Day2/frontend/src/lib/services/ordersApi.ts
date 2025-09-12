// lib/services/ordersApi.ts
import { api } from "./api"; // <-- your base api (fetchBaseQuery setup)

// ===== Types =====
export enum OrderStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  PROCESSING = "PROCESSING",
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export interface Order {
  _id: string;
  orderNumber: number;
  userId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
  paidUsing?: string;
}

export interface CreateOrderDto {
  shippingAddress: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

// ===== API Slice =====
export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new order
    createOrder: builder.mutation<Order, CreateOrderDto>({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),

    // Get all orders (admin gets all, customer gets their own)
    getOrders: builder.query<Order[], void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),

    // Get a single order
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Orders", id }],
    }),

    // Update order status (admin only)
    updateOrderStatus: builder.mutation<
      Order,
      { id: string; data: UpdateOrderStatusDto }
    >({
      query: ({ id, data }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Orders", id },
        "Orders",
      ],
    }),

    // Cancel an order (customer only)
    cancelOrder: builder.mutation<Order, string>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: (_res, _err, id) => [{ type: "Orders", id }, "Orders"],
    }),
  }),
  overrideExisting: false,
});

// ===== Hooks =====
export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = ordersApi;
