import { baseApi } from './baseApi.ts';
import { Product } from "../models/Product.ts";
import AttributeGroup from "../models/AttributeGroup.ts";

interface FilterProductsResponse {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product[], void>({
      query: () => ({
        url: 'products/all',
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
    getAvailableProducts: builder.query<Product[], void>({
      query: () => ({
        url: 'products/available',
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
    filterProducts: builder.query<
      FilterProductsResponse,
      {
        categoryId: number;
        minPrice?: number;
        maxPrice?: number;
        filter?: string;
        sort?: string;
        page?: number;
        pageSize?: number;
      }
    >({
      query: ({
        categoryId,
        minPrice,
        maxPrice,
        filter: filterText,
        sort,
        page = 1,
        pageSize = 20,
      }) => ({
        url: `products/filter/${categoryId}`,
        method: 'GET',
        params: {
          minPrice,
          maxPrice,
          filter: filterText,
          sort,
          page,
          pageSize,
        },
      }),
      providesTags: ['Products'],
    }),
    // ...existing code...
        getAttributeGroups: builder.mutation<AttributeGroup[], { categoryId: number; productIds?: number[]; selectedAttrsIds?: number[] }>({
          query: ({ categoryId, productIds, selectedAttrsIds }) => ({
            url: `products/attribute/${categoryId}`,
            method: 'POST',
            body: {
              productIds,
              selectedAttrsIds,
            },
          }),
        }),
    // ...existing code...
    getProductById: builder.query<Product, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
    searchProducts: builder.query<Product[], { query: string; page?: number; pageSize?: number }>({
      query: ({ query, page = 1, pageSize = 20 }) => ({
        url: `products/search/${encodeURIComponent(query)}`,
        method: 'GET',
        params: {
          page,
          pageSize,
        },
      }),
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useFilterProductsQuery,
  useGetAttributeGroupsMutation,
  useSearchProductsQuery,
} = productsApi;
