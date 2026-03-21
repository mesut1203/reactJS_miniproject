import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductById, getProductReviews, getRelatedProducts } from "@/service/productService";
import type { Product, Review, RatingStat } from "@/service/productService";

export const fetchProductDetail = createAsyncThunk(
  "productDetail/fetchProductDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getProductById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch product");
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  "productDetail/fetchProductReviews",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getProductReviews(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  "productDetail/fetchRelatedProducts",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getRelatedProducts(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch related products");
    }
  }
);

interface ProductDetailState {
  product: Product | null;
  reviews: Review[];
  reviewsStats: {
    avgRating: number;
    total: number;
    ratingStats: RatingStat[];
  } | null;
  relatedProducts: Product[];
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

const initialState: ProductDetailState = {
  product: null,
  reviews: [],
  reviewsStats: null,
  relatedProducts: [],
  loading: {},
  error: {},
};

export const productDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Product Detail
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading.product = true;
        state.error.product = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading.product = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading.product = false;
        state.error.product = action.payload as string;
      });

    // Reviews
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading.reviews = true;
        state.error.reviews = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading.reviews = false;
        state.reviews = action.payload.reviews;
        state.reviewsStats = {
          avgRating: action.payload.avgRating,
          total: action.payload.total,
          ratingStats: action.payload.ratingStats,
        };
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading.reviews = false;
        state.error.reviews = action.payload as string;
      });

    // Related Products
    builder
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.loading.relatedProducts = true;
        state.error.relatedProducts = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.loading.relatedProducts = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.loading.relatedProducts = false;
        state.error.relatedProducts = action.payload as string;
      });
  },
});

export default productDetailSlice.reducer;
