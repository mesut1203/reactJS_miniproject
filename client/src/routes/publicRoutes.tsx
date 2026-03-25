// import { routes } from "@/constants/route";
import { RouteNames } from "@/constants/route";
import AuthLayout from "@/layouts/AuthLayout/AuthLayout";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import GuestMiddlewares from "@/middlewares/GuestMiddlewares";
import GoogleCallback from "@/pages/Auth/GoogleCallback";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Home from "@/pages/Home/Home";
import Search from "@/pages/Search/Search";
import Product from "@/pages/Product/Product";
import { Route } from "react-router-dom";

export const publicRoutes = (
  <>
    <Route element={<MainLayout />}>
      <Route path={RouteNames.HOME} element={<Home />} />
      <Route path={RouteNames.SEARCH} element={<Search />} />
      <Route path={RouteNames.PRODUCT} element={<Product />} />
    </Route>
    <Route element={<GuestMiddlewares />}>
      <Route element={<AuthLayout />}>
        <Route path={RouteNames.AUTH_LOGIN} element={<Login />} />
        <Route path={RouteNames.AUTH_REGISTER} element={<Register />} />
      </Route>
      <Route path={RouteNames.GOOGLE_CALLBACK} element={<GoogleCallback />} />
    </Route>
  </>
);
