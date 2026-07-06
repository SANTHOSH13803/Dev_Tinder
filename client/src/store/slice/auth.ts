import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./user";
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  authInitialized: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },

    setAuthInitialized(state) {
      state.authInitialized = true;
    }
  }
});

export const { setUser, clearUser, setAuthInitialized } = authSlice.actions;

export default authSlice.reducer;
