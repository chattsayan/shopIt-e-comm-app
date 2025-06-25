import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/new",
        method: "POST",
        body,
      }),
    }),
    myOrders: builder.query({
      query: () => ({
        url: `/me/orders`,
      }),
    }),
    orderDetails: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
      }),
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
  }),
});

export const {
  useCreateNewOrderMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useStripeCheckoutSessionMutation,
  useLazyGetDashboardSalesQuery,
} = orderApi;
