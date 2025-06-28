import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  // ----- required portion for making live -----
  // baseQuery: fetchBaseQuery({
  //   baseUrl: "https://shopit-backend-bcvt.onrender.com/api/v1",
  //   credentials: "include",
  // }),
  // ----- required portion for making live -----
  tagTypes: ["Order", "AdminOrders"],
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/new",
        method: "POST",
        body,
      }),
    }),
    myOrders: builder.query({
      query: () => "/me/orders",
    }),
    orderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),
    stripeCheckoutSession: builder.mutation({
      query: (body) => ({
        url: "/payment/checkout_session",
        method: "POST",
        body,
      }),
    }),
    getDashboardSales: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/admin/get_sales?startDate=${startDate}&endDate=${endDate}`,
      }),
    }),
    adminOrders: builder.query({
      query: () => "/admin/orders",
      providesTags: ["AdminOrders"],
    }),
    updateOrder: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/orders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminOrders"],
    }),
  }),
});

export const {
  useCreateNewOrderMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useStripeCheckoutSessionMutation,
  useLazyGetDashboardSalesQuery,
  useAdminOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
