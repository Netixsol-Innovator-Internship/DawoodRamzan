import { api } from "./api";

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
  size: string;
}

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => "/carts",
      providesTags: ["Cart"],
    }),
    getCartItem: builder.query<CartItem, string>({
      query: (itemId) => `/carts/item/${itemId}`,
      providesTags: (result, error, id) => [{ type: "Cart", id }],
    }),
    addToCart: builder.mutation<Cart, AddToCartDto>({
      query: (body) => ({
        url: "/carts/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<
      Cart,
      { itemId: string; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `/carts/item/${itemId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation<Cart, string>({
      query: (itemId) => ({
        url: `/carts/item/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<Cart, void>({
      query: () => ({
        url: "/carts",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useGetCartItemQuery, // 👈 new hook
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
