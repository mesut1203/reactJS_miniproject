import { Routes } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { privateRoutes } from "./routes/privateRoutes";

export default function App() {
    return (
        <Routes>
            {publicRoutes}
            {privateRoutes}
        </Routes>
    );
}
