import { Routes } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { privateRoutes } from "./routes/privateRoutes";
import { coreRoutes } from "./core/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
    return (
        <>
            <Routes>
                {publicRoutes}
                {privateRoutes}
                {coreRoutes}
            </Routes>

            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}
