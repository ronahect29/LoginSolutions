import type { JSX } from "react";
import { Navigate } from "react-router-dom";
export function PrivateRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem("token_marcajes");
    return token ? children : <Navigate to="/login" replace />;
}