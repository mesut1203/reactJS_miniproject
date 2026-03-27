import { client } from "@/utils/clients";

export interface Product {
  _id: string; // the recommended API uses _id, while /products seems to have no explicit id doc but let's use _id
  name: string;
  image: string;
  price: number;
  priceDiscount: number;
  brand: string;
  warranty: string;
  shippingFee: string;
  avgRating: number;
  reviewCount: number;
  category?: string;
  code?: string;
  description?: string;
  dealToday?: boolean;
  gallery?: string[];
}

export interface Review {
  rating: number;
  title: string;
  content: string;
  user?: {
    userId: string;
    email: string;
  };
}

export interface RatingStat {
  star: number;
  count: number;
  percent: number;
}

export interface Category {
  _id: string;
  name: string;
}

/** Returns full category objects (id + name) — use this for filtering */
export const getCategoriesWithId = async (): Promise<Category[]> => {
  const { data } = await client.get("/categories");
  // API may return [{ _id, name }] or ["name"] depending on endpoint
  const raw: any[] = data.categories || [];
  if (raw.length === 0) return [];
  if (typeof raw[0] === "string") {
    // fallback: only names available, return without id
    return raw.map((name) => ({ _id: "", name }));
  }
  return raw.map((c) => ({ _id: c._id || c.id || "", name: c.name || "" }));
};

/** Returns only category names (legacy usage) */
export const getCategories = async () => {
  const cats = await getCategoriesWithId();
  return cats.map((c) => c.name);
};

export const getProducts = async (params?: any) => {
  const { data } = await client.get("/products", { params });
  return data; // { products, pagination }
};

export const getRecommendedProducts = async () => {
  const { data } = await client.get("/cart-suggest/recommended");
  return data.products as Product[];
};

export const getProductById = async (id: string) => {
  const { data } = await client.get(`/products/${id}`);
  return data.product as Product;
};

export const getProductReviews = async (id: string) => {
  const { data } = await client.get(`/products/${id}/reviews`);
  return data; // returns { reviews, avgRating, total, ratingStats }
};

export const getRelatedProducts = async (id: string) => {
  const { data } = await client.get(`/products/${id}/related`);
  return data.products as Product[];
};
