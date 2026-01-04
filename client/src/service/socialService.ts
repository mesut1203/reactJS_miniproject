export const getGoogleRedirectUrl = () => {
  const params = {
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URL,
    response_type: "code",
    scope: "email profile",
  };
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
    params
  )}`;
  return url;
};
