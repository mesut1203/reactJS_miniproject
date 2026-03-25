import { requestLogout } from "@/service/authService";
import { removeLocalToken } from "@/utils/auth";

export const useLogout = () => {
    const logout = async (redirectTo: string = "/") => {
        await requestLogout();
        removeLocalToken();
        // navigate(redirectTo);
        window.location.href = redirectTo;
    };
    return { logout };
};
