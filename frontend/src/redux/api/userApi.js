import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setUser } from "../slice/userSlice";

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
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useGetMeQuery } = userApi;
