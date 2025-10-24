import React from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="main-layout py-3 w-[80%] mx-auto">
            <Outlet />
        </div>
    );
}
