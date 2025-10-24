import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthMiddlewares() {
    const isAuth = false;
    if (!isAuth) {
        return <Navigate to={"/auth/login"} />;
    }

    return <Outlet />;
}
