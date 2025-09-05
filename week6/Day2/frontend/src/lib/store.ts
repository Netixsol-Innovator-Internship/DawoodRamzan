// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api"; // ✅ Base API (with productsApi injected)
import { authApi } from "./services/authApi"; // ✅ Auth API

export const store = configureStore({
  reducer: {
    // RTK Query reducers
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware) // ✅ important for productsApi
      .concat(authApi.middleware), // ✅ important for authApi
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
