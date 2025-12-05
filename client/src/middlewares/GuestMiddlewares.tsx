import { RouteNames } from "@/constants/route";
import { getLocalToken } from "@/utils/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestMiddlewares() {
    const isAuth = getLocalToken() ? true : false;
    if (!isAuth) {
        return <Navigate to={RouteNames.HOME} />;
    }

    return <Outlet />;
}
