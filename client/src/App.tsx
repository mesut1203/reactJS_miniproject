import { Routes } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { privateRoutes } from "./routes/privateRoutes";
import { coreRoutes } from "./core/routes";

export default function App() {
    return (
        <Routes>
            {publicRoutes}
            {privateRoutes}
            {coreRoutes}
        </Routes>
    );
}
