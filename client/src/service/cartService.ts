import { client } from "@/utils/clients";

export const addToCart = async (productId: string, quantity: number) => {
  const { data } = await client.post("/shopping-cart", { productId, quantity });
  return data;
};
