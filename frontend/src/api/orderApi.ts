import {baseApi} from './baseApi.ts';
import OrderItem from "../models/OrderItem";
import { Order } from '../models/Order.ts';

export interface PlaceOrderRequest {
  userId: number;
  paymentMethod: number;
  deliveryMethod: number;
  deliveryAddressId?: number;
  orderItems: OrderItem[];
}

export interface LiqPayPaymentData {
  data: string;
  signature: string;
}

export interface PlaceOrderResponse {
  orderId: number;
  paymentData: LiqPayPaymentData;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation<PlaceOrderResponse, PlaceOrderRequest>({
      query: (order) => ({
        url: "order/",
        method: "POST",
        body: order,
      }),
       invalidatesTags: ['Orders'],
    }),
    getUserOrders: builder.query<Order[], number>({
      query: (userId) => `order/user/${userId}`,
      providesTags: ['Orders']
    }),
    getOrderItems: builder.query<OrderItem[], number>({
      query: (orderId) => `order/${orderId}/order_items`,
      providesTags: ['Orders']
    }),
    getOrderById: builder.query<Order, number>({
      query: (orderId) => `order/${orderId}`,
      providesTags: ['Orders']
    }),
    cancelOrder: builder.mutation<void, number>({
      query: (orderId) => ({
        url: `order/cancel/${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: ['Orders'],
    }),
  })
});

export const {
  usePlaceOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderItemsQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} = orderApi;