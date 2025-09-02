import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { carsApi } from "./carsApi";
import { auctionsApi } from "./auctionApi";
import { usersApi } from "./usersApi";
import { bidsApi } from "./bidsApi"; // ✅ import
import authReducer from "../features/apiSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [carsApi.reducerPath]: carsApi.reducer,
    [auctionsApi.reducerPath]: auctionsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [bidsApi.reducerPath]: bidsApi.reducer, // ✅ add reducer
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      carsApi.middleware,
      auctionsApi.middleware,
      usersApi.middleware,
      bidsApi.middleware // ✅ add middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
