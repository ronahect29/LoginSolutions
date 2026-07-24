import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/Auth/LoginPage";
import { PublicRoute } from "./PublicRoute";
import { RoleRoute } from "./RoleRouter";
import { AdminLayout } from "../components/layout/AdminLayout";
import { DashboardPage } from "../pages/Dashboard";
import { RolesPage } from "../pages/Roles";
import { UsersPage } from "../pages/Users";

export function AppRouter() {
    return (
        <Routes>
            {/* Login */}
            <Route
                path="/admin/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />

            {/* Dashboard */}
            <Route
                element={
                    <RoleRoute allowedRoles={["SA-PAW"]}>
                        <AdminLayout />
                    </RoleRoute>
                }
            >
                <Route path="/admin/home-admin" element={<DashboardPage />} />
            </Route>

            {/* Usuarios */}
            <Route
                element={
                    <RoleRoute allowedRoles={["SA-PAW", "SUP"]}>
                        <AdminLayout />
                    </RoleRoute>
                }
            >
                <Route path="/admin/usuarios" element={<UsersPage />} />
            </Route>

            {/* Roles */}
            <Route
                element={
                    <RoleRoute allowedRoles={["SA-PAW"]}>
                        <AdminLayout />
                    </RoleRoute>
                }
            >
                <Route path="/admin/roles" element={<RolesPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
        // <Routes>
        //     {/* Login */}
        //     <Route
        //         path="/admin/login"
        //         element={
        //             <PublicRoute>
        //                 <LoginPage />
        //             </PublicRoute>
        //         }
        //     />

        //     {/* Super Admin */}
        //     <Route
        //         element={
        //             <RoleRoute allowedRoles={["SA-PAW"]}>
        //                 <AdminLayout />
        //             </RoleRoute>
        //         }
        //     >
        //         <Route path="/admin/home-admin" element={<DashboardPage />} />
        //         <Route path="/admin/usuarios" element={<UsersPage />} />
        //         <Route path="/admin/roles" element={<RolesPage />} />
        //     </Route>

        //     {/* Fallback */}
        //     <Route path="*" element={<Navigate to="/admin/login" replace />} />
        // </Routes>
    );
}