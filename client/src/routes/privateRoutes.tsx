// import { routes } from "@/constants/route";
import { RouteNames } from "@/constants/route";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import AuthMiddlewares from "@/middlewares/AuthMiddlewares";
import Account from "@/pages/Account/Account";
import Cart from "@/pages/Cart/Cart";
import { Route } from "react-router-dom";

export const privateRoutes = (
    <>
        <Route element={<AuthMiddlewares />}>
            <Route element={<MainLayout />}>
                <Route path={RouteNames.ACCOUNT} element={<Account />} />
                <Route path={RouteNames.CART} element={<Cart />} />
            </Route>
        </Route>
    </>
);
