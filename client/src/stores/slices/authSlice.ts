import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getAuthProfile } from "../middlewares/authMiddlewares";
type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
};

type AuthState = {
  isAuth: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  isAuth: false, //Trạng thai đăng nhập
  user: null, // Thông tin user
  isLoading: true, // Trạng thái loading
  accessToken: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearAuth: (state) => {
      state.isAuth = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAuthProfile.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAuthProfile.fulfilled, (state, action) => {
      console.log("🎯 Redux nhận user:", action.payload);
      state.isAuth = true;
      state.user = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAuthProfile.rejected, (state) => {
      state.isAuth = false;
      state.user = null;
      state.isLoading = false;
    });
  },
});

export const { setToken, clearAuth } = authSlice.actions;

// export const { updateAuthStatus } = authSlice.actions;
