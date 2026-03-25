import { client } from "@/utils/clients";
import type { Product } from "./productService";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  avgRating: number;
  reviewCount: number;
  priceDiscount: number;
  price: number;
  brand: string;
  warranty: string;
  shippingFee: string | number;
  quantity: number;
  total: number;
}

export interface CartData {
  items: CartItem[];
  total: number;
}

export const getCart = async (): Promise<CartData> => {
  const { data } = await client.get("/shopping-cart");
  return data;
};

export const addToCart = async (productId: string, quantity: number) => {
  const { data } = await client.post("/shopping-cart", { productId, quantity });
  return data;
};

export const clearCart = async () => {
  const { data } = await client.delete("/shopping-cart");
  return data;
};

export const removeFromCart = async (productId: string) => {
  const { data } = await client.delete(`/shopping-cart/${productId}`);
  return data;
};

export const updateCartQuantity = async (productId: string, quantity: number) => {
  const { data } = await client.patch(`/shopping-cart/${productId}`, { quantity });
  return data;
};

export const getCartSuggestYouMightAlsoLike = async (): Promise<{ products: Product[] }> => {
  const { data } = await client.get("/cart-suggest/you-might-also-like");
  return data;
};

export const getCartSuggestRecommended = async (): Promise<{ products: Product[] }> => {
  const { data } = await client.get("/cart-suggest/recommended");
  return data;
};
