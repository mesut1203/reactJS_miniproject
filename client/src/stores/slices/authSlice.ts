import { createSlice } from "@reduxjs/toolkit";

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
};

const initialState: AuthState = {
    isAuth: false, //Trạng thai đăng nhập
    user: null, // Thông tin user
    isLoading: true, // Trạng thái loading
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // updateAuthStatus: (state, action) => {
        //     state.isAuth = action.payload;
        // },
        // updateAuthUser: (state, action) => {
        //     state.user = action.payload;
        // },
        // updateAuthLoading: (state, action) => {
        //     state.isLoading = action.payload;
        // },
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
        builder.addCase(getAuthProfile.rejected, (state,action) => {
            console.log("⚠ rejected:", action.payload);
            state.isAuth = false;
            state.user = null;
            state.isLoading = false;
        });
    },
});

// export const { updateAuthStatus } = authSlice.actions;
