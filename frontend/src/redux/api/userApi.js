import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../slice/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["User"],
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
  }),
});

export const {
  useGetMeQuery,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;
