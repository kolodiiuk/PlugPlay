import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {storage} from "../utils/StorageService.ts";

export const API_BASE_URL = 'https://plugplay.dev1.dev';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    prepareHeaders: (headers, api) => {
      const token = storage.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const skipJsonContentType = [
        "uploadProductImage",  
      ];

      if (!skipJsonContentType.includes(api.endpoint)) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),
  tagTypes: ["Wishlist", "Cart", "Products", "Orders"],
  endpoints: () => ({}),
});
