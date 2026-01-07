// import { RouteNames } from "@/constants/route";
// import { client } from "@/utils/clients";

// export const getGoogleRedirectUrl = () => {
//   console.log("CLIENT_ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
//   console.log("REDIRECT:", import.meta.env.VITE_GOOGLE_REDIRECT_URL);
//   const params = {
//     client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
//     redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URL,
//     response_type: "code",
//     scope: "email profile",
//   };
//   const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
//     params
//   )}`;
//   return url;
// };

// export const getGoogleAccessToken = async () => {
//   const data = await client.post( "/auth/google/token", {
//     url_target: window.location.origin + RouteNames.ACCOUNT
//   } );
// }

// service/auth.ts
import { client } from "@/utils/clients";

export const getGoogleLoginUrl = async (): Promise<string> => {
  const res = await client.get("/auth/google/url");
  return res.data.url;
};
