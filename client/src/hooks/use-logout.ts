import { requestLogout } from "@/service/authService";

export const useLogout = async () => {
    try {
        await requestLogout();
    } catch (error) {}
};
