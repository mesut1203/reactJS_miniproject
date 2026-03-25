import { RouteNames } from "@/constants/route";
import { getAuthProfile } from "@/stores/middlewares/authMiddlewares";
import type { AppDispatch, RootState } from "@/stores/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function GuestMiddlewares() {
  const { isAuth, isLoading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAuthProfile());
  }, []);

  if (location.pathname === RouteNames.GOOGLE_CALLBACK) {
    return <Outlet />;
  }

  if (isLoading) {
    return null;
  }

  if (isAuth) {
    return <Navigate to={RouteNames.HOME} />;
  }

  return <Outlet />;
}
