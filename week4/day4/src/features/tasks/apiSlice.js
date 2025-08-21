import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
console.log("Base URL set to: https://dawoodweek4-day1-backend.vercel.app/api");

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dawoodweek4-day1-backend.vercel.app/api",
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "/tasks",
      providesTags: ["Task"],
    }),
    addTask: builder.mutation({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Task"],
    }),
    toggleTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useToggleTaskMutation,
  useDeleteTaskMutation,
} = apiSlice;
