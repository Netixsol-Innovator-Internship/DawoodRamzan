import { api } from "./api"; // <-- your base api (fetchBaseQuery setup)

// ===== Types =====
export interface User {
  isActive: boolean;
  username: string;
  _id: string;
  email: string;
  role: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  points?: number;
  isActive?: boolean; // ✅ Added this
}

// ===== API Slice =====
export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create User
    createUser: builder.mutation<User, CreateUserDto>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // Get All Users
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // Get Single User
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    // Update User
    updateUser: builder.mutation<User, { id: string; body: UpdateUserDto }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Users", id }],
    }),

    // Delete User
    deleteUser: builder.mutation<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // Add Points
    addPoints: builder.mutation<User, { id: string; points: number }>({
      query: ({ id, points }) => ({
        url: `/users/${id}/add-points`,
        method: "PATCH", // ✅ You’ll need this endpoint in your NestJS controller
        body: { points },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Users", id }],
    }),

    // Subtract Points
    subPoints: builder.mutation<User, { id: string; points: number }>({
      query: ({ id, points }) => ({
        url: `/users/${id}/sub-points`,
        method: "PATCH", // ✅ Same here
        body: { points },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Users", id }],
    }),
  }),
  overrideExisting: false,
});

// ===== Export Hooks =====
export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAddPointsMutation,
  useSubPointsMutation,
} = usersApi;
