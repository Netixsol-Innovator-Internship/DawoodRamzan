// src/features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse } from "@/services/authApi";

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    username?: string;
  } | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.access_token;
      state.user = action.payload.user ?? null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    loadFromStorage: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        state.token = token;
      }
    },
  },
});

export const { setCredentials, logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
