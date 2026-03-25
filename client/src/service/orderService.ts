import { client } from "@/utils/clients";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  priceDiscount: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  address: string;
  status: "pending" | "cancelled" | "processing" | "shipped" | "delivered" | string;
  createdAt: string;
  trackingId?: string;
}

export const createOrder = async (orderData?: { address?: string }): Promise<{ message: string, order: Order }> => {
  const { data } = await client.post("/orders", orderData || {});
  return data;
};

export const getOrders = async (): Promise<{ orders: Order[] }> => {
  const { data } = await client.get("/orders");
  return data;
};

export const cancelOrder = async (orderId: string): Promise<{ message: string, order: Order }> => {
  const { data } = await client.delete(`/orders/${orderId}`);
  return data;
};

export const getOrderById = async (orderId: string): Promise<{ order: Order; trackingId?: string }> => {
  const { data } = await client.get(`/orders/${orderId}`);
  return data;
};
