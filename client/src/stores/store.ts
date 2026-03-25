import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authSlice";
import { productSlice } from "./slices/productSlice";

import { productDetailSlice } from "./slices/productDetailSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        product: productSlice.reducer,
        productDetail: productDetailSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
