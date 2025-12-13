import {baseApi} from './baseApi.ts';
import { Attribute } from '../models/Attribute.ts';
import { Category } from '../models/Category.ts';

export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryId: number;
    productAttributes: ProductAttributeCreateRequest[];
}

export interface ProductAttributeCreateRequest {
    attributeId: number;
    value: string;
}

export const adminProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    addProduct: builder.mutation<number, ProductRequest>({
      query: (body) => ({
        url: "admin/product",
        method: "POST",
        body,
      }),
      //invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<void, { prodId: number; data: ProductRequest }>({
      query: ({ prodId, data }) => ({
        url: `admin/product/${prodId}`,
        method: "PUT",
        body: data,
      }),
      //invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (prodId) => ({
        url: `admin/product/${prodId}`,
        method: "DELETE",
      }),
      //invalidatesTags: ["Products"],
    }),

    getAllCategories: builder.query<Category[], void>({
      query: () => `admin/product/category/all`,
      //providesTags: ["Categories"],
    }),

    getCategoryById: builder.query<Category, number>({
      query: (id) => `admin/product/category/${id}`,
      //providesTags: (result, error, id) => [{ type: "Categories", id }],
    }),

    getAllAttributes: builder.query<Attribute[], void>({
      query: () => `admin/product/attribute/all`,
      //providesTags: ["Attributes"],
    }),

    getAttributeById: builder.query<Attribute, number>({
      query: (id) => `admin/product/attribute/${id}`,
      //providesTags: (result, error, id) => [{ type: "Attributes", id }],
    }),

    uploadProductImage: builder.mutation<void, { productId: number; file: File }>({
      query: ({ productId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `admin/product/image/${productId}`,
          method: "POST",
          body: formData,
        };
      },
      //invalidatesTags: ["Products"],
    }),

  }),

});

export const {
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetAllAttributesQuery,
  useGetAttributeByIdQuery,
  useUploadProductImageMutation,
} = adminProductApi;