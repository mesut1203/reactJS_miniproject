import { RouteNames } from "@/constants/route";
import { getAuthProfile } from "@/stores/middlewares/authMiddlewares";
import type { AppDispatch, RootState } from "@/stores/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestMiddlewares() {
    const { isAuth, isLoading } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(getAuthProfile());
    }, []);

    if (isLoading) {
        return null;
    }

    if (isAuth) {
        return <Navigate to={RouteNames.HOME} />;
    }

    return <Outlet />;
}
