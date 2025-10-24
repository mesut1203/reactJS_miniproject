import MainLayout from "@/layouts/MainLayout/MainLayout";
import AuthMiddlewares from "@/middlewares/AuthMiddlewares";
import Account from "@/pages/Account/Account";
import { Route } from "react-router-dom";

export const privateRoutes = (
    <>
        <Route element={<AuthMiddlewares />}>
            <Route element={<MainLayout />}>
                <Route path="/account" element={<Account />} />
            </Route>
        </Route>
    </>
);
