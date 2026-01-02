import { requestLogout, requestRefreshToken } from "@/service/authService";
import {
    getLocalRefreshToken,
    getLocalToken,
    removeLocalToken,
    saveLocalRefreshToken,
    saveLocalToken,
} from "@/utils/auth";
import axios from "axios";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
});

// let refreshTokenPromise: Promise<{
//     newToken: { accessToken: string; refreshToken: string };
// }> | null = null;

instance.interceptors.request.use(
    (config) => {
        if (getLocalToken()) {
            const accessToken = getLocalToken();
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !["/auth/refresh", "/auth/logout"].includes(originalRequest.url) &&
            getLocalRefreshToken()
        ) {
            originalRequest._retry = true;

            try {
                const data = await requestRefreshToken();

                saveLocalToken(data.accessToken);
                saveLocalRefreshToken(data.refreshToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                return instance(originalRequest);
            } catch (err) {
                await requestLogout();
                removeLocalToken();
                window.location.href = "/auth/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);
