// src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="flex h-screen bg-gray-100 p-8">
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 xl:w-2/5 px-6 h-full">
                <div className="p-8 w-full max-w-xl h-full flex flex-col justify-center">
                    <Outlet />
                </div>
            </div>

            <div className="hidden md:flex md:w-1/2 xl:w-3/5 bg-blue-600 rounded-3xl items-center justify-center p-12" />
        </div>
    );
}
