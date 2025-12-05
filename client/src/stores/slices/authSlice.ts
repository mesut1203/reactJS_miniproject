import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuth: false,
    },
    reducers: {
        updateAuthStatus: (state, action) => {
            state.isAuth = action.payload;
        },
    },
});

export const { updateAuthStatus } = authSlice.actions;
