import { instance } from "@/lib/axios";

export const client = instance;

const token = localStorage.getItem("accessToken");

if (token) {
  client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
