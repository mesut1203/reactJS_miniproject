import Forbidden from "@/errors/Forbidden/Forbidden";
import NotFound from "@/errors/NotFound/NotFound";
import { Route } from "react-router-dom";

export const coreRoutes = (
    <>
        <Route path="*" element={<NotFound />} />
        <Route path="/forbidden" element={<Forbidden />} />
    </>
);
