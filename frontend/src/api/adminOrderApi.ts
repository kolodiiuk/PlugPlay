import { baseApi } from "./baseApi";
import OrderStatus from "../models/enums/OrderStatus";
import PaymentStatus from "../models/enums/PaymentStatus";
import { Order } from "../models/Order";

export const adminOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    updateOrderStatus: builder.mutation<void, {
      orderId: number;
      status: OrderStatus;
    }>({
      query: ({ orderId, status }) => ({
        url: `admin/order/order-status/${orderId}`,
        method: "PUT",
        body: status
      }),
      invalidatesTags: ["Orders"]
    }),

    updatePaymentStatus: builder.mutation<void, {
      orderId: number;
      paymentStatus: PaymentStatus;
    }>({
      query: ({ orderId, paymentStatus }) => ({
        url: `admin/order/payment-status/${orderId}`,
        method: "PUT",
        body: paymentStatus
      }),
      invalidatesTags: ["Orders"]
    }),

    cancelOrderAdmin: builder.mutation<void, number>({
      query: (orderId) => ({
        url: `admin/order/cancel/${orderId}`,
        method: "PUT"
      }),
      invalidatesTags: ["Orders"]
    }),
    getAllOrders: builder.query<Order[], void>({
      query: () => `admin/order/`,
      providesTags: ['Orders']
    }),
  })
});

export const {
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useCancelOrderAdminMutation,
  useGetAllOrdersQuery,
} = adminOrderApi;