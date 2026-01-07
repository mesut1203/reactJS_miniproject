import { client } from "./clients";

export const saveLocalToken = (token: string) => {
  localStorage.setItem("access_token", token);
};

export const saveLocalRefreshToken = (token: string) => {
  localStorage.setItem("refresh_token", token);
};

export const getLocalToken = () => {
  return localStorage.getItem("access_token");
};

export const getLocalRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

export const removeLocalToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const handleGoogleLogin = async () => {
  const res = await client.get("/auth/google/url");
  window.location.href = res.data.url;
};
