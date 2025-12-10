import { baseApi } from "./baseApi";
import { WishList } from "../models/WishList";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    addToWishlist: builder.mutation<{ itemId: number }, number>({
      query: (productId) => ({
        url: `wishlist/${productId}`,
        method: "POST",
      }),
    }),

    getWishlistItem: builder.query<WishList, number>({
      query: (itemId) => `wishlist/item/${itemId}`,
    }),

    isInWishlist: builder.query<boolean, number>({
      query: (productId) => `wishlist/${productId}`,
    }),

    getUserWishlist: builder.query<WishList[], void>({
      query: () => `wishlist`,
    }),

    removeWishlistItem: builder.mutation<void, number>({
      query: (itemId) => ({
        url: `wishlist/${itemId}`,
        method: "DELETE",
      }),
    }),

    clearWishlist: builder.mutation<void, void>({
      query: () => ({
        url: `wishlist`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useGetWishlistItemQuery,
  useIsInWishlistQuery,
  useGetUserWishlistQuery,
  useRemoveWishlistItemMutation,
  useClearWishlistMutation,
} = wishlistApi;