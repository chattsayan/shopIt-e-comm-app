import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userApi } from "./userApi";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE_URL}/api/v1` }),
  credentials: "include",
  tagTypes: ["User"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query(body) {
        return {
          url: "/register",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    login: builder.mutation({
      query(body) {
        return {
          url: "/login",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => "/logout",
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate and refetch user data to clear the cache
          dispatch(userApi.util.invalidateTags(["User"]));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
  authApi;
