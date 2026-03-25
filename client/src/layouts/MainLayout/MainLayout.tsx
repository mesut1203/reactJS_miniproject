import { getAuthProfile } from "@/stores/middlewares/authMiddlewares";
import type { AppDispatch } from "@/stores/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { getLocalToken } from "@/utils/auth";

export default function MainLayout() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const token = getLocalToken();

    if (token) {
      dispatch(getAuthProfile());
    }
  }, [dispatch]);

  return (
    <div className="main-layout py-3 mx-auto ">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
