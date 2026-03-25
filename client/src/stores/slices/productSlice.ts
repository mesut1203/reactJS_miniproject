import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories, getProducts, getRecommendedProducts } from "@/service/productService";
import type { Product } from "@/service/productService";

export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await getCategories();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);

export const fetchTodayDeals = createAsyncThunk(
  "product/fetchTodayDeals",
  async (limit: number = 8, { rejectWithValue }) => {
    try {
      const data = await getProducts({ dealToday: true, limit });
      return data.products as Product[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch today deals");
    }
  }
);

export const fetchRecommended = createAsyncThunk(
  "product/fetchRecommended",
  async (_, { rejectWithValue }) => {
    try {
      // If auth fails for this endpoint we could optionally fall back to a standard getProducts, 
      // but let's try calling it first.
      return await getRecommendedProducts();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch recommended");
    }
  }
);

export const fetchTopRated = createAsyncThunk(
  "product/fetchTopRated",
  async (limit: number = 8, { rejectWithValue }) => {
    try {
      const data = await getProducts({ sort: "review_avg", limit });
      return data.products as Product[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch top rated");
    }
  }
);

export const fetchExploreMore = createAsyncThunk(
  "product/fetchExploreMore",
  async (limit: number = 20, { rejectWithValue }) => {
    try {
      const data = await getProducts({ limit });
      return data.products as Product[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch explore more");
    }
  }
);

interface ProductState {
  categories: string[];
  todayDeals: Product[];
  recommended: Product[];
  topRated: Product[];
  exploreMore: Product[];
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

const initialState: ProductState = {
  categories: [],
  todayDeals: [],
  recommended: [],
  topRated: [],
  exploreMore: [],
  loading: {},
  error: {},
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleAsync = (thunk: any, key: keyof ProductState) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading[key as string] = true;
          state.error[key as string] = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading[key as string] = false;
          (state as any)[key] = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading[key as string] = false;
          state.error[key as string] = action.payload as string;
        });
    };

    handleAsync(fetchCategories, "categories");
    handleAsync(fetchTodayDeals, "todayDeals");
    handleAsync(fetchRecommended, "recommended");
    handleAsync(fetchTopRated, "topRated");
    handleAsync(fetchExploreMore, "exploreMore");
  },
});

export default productSlice.reducer;
