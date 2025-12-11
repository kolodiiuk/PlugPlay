import {baseApi} from './baseApi.ts';
import {CartItem} from "../models/CartItem.ts";

export interface CreateCartItemDto {
  productId: number;
  quantity: number;
  userId: number;
}

export interface UpdateCartItemQuantityDto {
  cartItemId: number;
  newQuantity: number;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], number>({
      query: (userId) => `cart/${userId}`,
      providesTags: ["Cart"],
    }),
    
    getCartItem: builder.query<CartItem, number>({
      query: (itemId) => `cart/item/${itemId}`,
      providesTags: ["Cart"],
    }),
    
    getCartItemsTotal: builder.query<number, number>({
      query: (userId) => `cart/total/${userId}`,
      providesTags: ["Cart"],
    }),
    isInCart: builder.query<boolean, { productId: number; userId: number }>({
      query: ({productId, userId}) => `cart/isincart/${productId}/${userId}`,
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<{ cartItemId: number }, CreateCartItemDto>({
      query: (dto) => ({
        url: 'cart',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateQuantity: builder.mutation<void, UpdateCartItemQuantityDto>({
      query: (dto) => ({
        url: 'cart/quantity',
        method: 'PUT',
        body: dto,
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteCartItem: builder.mutation<void, number>({
      query: (itemId) => ({
        url: `cart/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<void, number>({
      query: (userId) => ({
        url: `cart/clear/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useIsInCartQuery,
  useAddToCartMutation,
  useUpdateQuantityMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
} = cartApi;
