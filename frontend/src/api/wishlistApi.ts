import { baseApi } from "./baseApi";
import { WishList } from "../models/WishList";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    addToWishlist: builder.mutation<{ itemId: number }, number>({
      query: (productId) => ({
        url: `wishlist/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Wishlist"], 
    }),

    removeWishlistItem: builder.mutation<void, number>({
      query: (itemId) => ({
        url: `wishlist/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    clearWishlist: builder.mutation<void, void>({
      query: () => ({
        url: `wishlist`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    getWishlistItem: builder.query<WishList, number>({
      query: (itemId) => `wishlist/item/${itemId}`,
      providesTags: ["Wishlist"],
    }),

    isInWishlist: builder.query<boolean, number>({
      query: (productId) => `wishlist/${productId}`,
      providesTags: ["Wishlist"],
    }),

    getUserWishlist: builder.query<WishList[], void>({
      query: () => `wishlist`,
      providesTags: ["Wishlist"],
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