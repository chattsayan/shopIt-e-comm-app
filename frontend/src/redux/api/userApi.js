import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../slice/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  // ----- required portion for making live -----
  // baseQuery: fetchBaseQuery({
  //   baseUrl: "https://shopit-backend-bcvt.onrender.com/api/v1",
  //   credentials: "include",
  // }),
  // ----- required portion for making live -----
  tagTypes: ["User", "AdminUsers", "AdminUser"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/me",
      providesTags: ["User"],
      //   transformResponse: (res) => res.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data?.user));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          console.log(error);
        }
      },
    }),
    updateUser: builder.mutation({
      query(body) {
        return {
          url: "/me/update",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/me/upload_avatar",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query: (body) => ({
        url: "/password/update",
        method: "PUT",
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/password/forgot",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, body }) => ({
        url: `/password/reset/${token}`,
        method: "PUT",
        body,
      }),
    }),
    getAdminUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["AdminUsers"],
    }),
    getUserDetails: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: ["AdminUser"],
    }),
    adminUpdateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body,
      }),
      providesTags: ["AdminUsers"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      providesTags: ["AdminUsers"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAdminUsersQuery,
  useGetUserDetailsQuery,
  useAdminUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
