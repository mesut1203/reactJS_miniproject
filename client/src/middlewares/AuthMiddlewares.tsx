// import { getLocalToken } from "@/utils/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthMiddlewares() {
    const isAuth = true;
    if (!isAuth) {
        return <Navigate to={"/auth/login"} />;
    }

    return <Outlet />;
}
