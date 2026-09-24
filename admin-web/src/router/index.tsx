import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { AdminLayout } from "../components/layout/AdminLayout";
import { AppsPage } from "../pages/Apps";
import { LoginPage } from "../pages/Auth/LoginPage";
import { DashboardPage } from "../pages/Dashboard";
import { RolesPage } from "../pages/Roles";
import { UsersPage } from "../pages/Users";
import { PublicRoute } from "./PublicRoute";
import { RoleRoute } from "./RoleRouter";

export function AppRouter() {
    return (
        <Routes>
            {/* ======================================================
                LOGIN
                ====================================================== */}

            <Route
                path="/admin/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />

            {/* ======================================================
                DASHBOARD
                ====================================================== */}

            <Route
                element={
                    <RoleRoute
                        allowedRoles={[
                            "SA-PAW",
                        ]}
                    >
                        <AdminLayout />
                    </RoleRoute>
                }
            >
                <Route
                    path="/admin/home-admin"
                    element={<DashboardPage />}
                />
            </Route>

            {/* ======================================================
                USUARIOS
                ====================================================== */}

            <Route
                element={
                    <RoleRoute
                        allowedRoles={[
                            "SA-PAW",
                            "SUP",
                        ]}
                    >
                        <AdminLayout />
                    </RoleRoute>
                }
            >
                <Route
                    path="/admin/usuarios"
                    element={<UsersPage />}
                />
            </Route>

            {/* ======================================================
                ROLES
                ====================================================== */}

            <Route
                element={
                    <RoleRoute
                        allowedRoles={[
                            "SA-PAW",
                        ]}
                    >
                        <AdminLayout />
                    </RoleRoute>
                }
            >
                <Route
                    path="/admin/roles"
                    element={<RolesPage />}
                />
            </Route>

            {/* ======================================================
                APLICACIONES
                ====================================================== */}

            <Route
                element={
                    <RoleRoute
                        allowedRoles={[
                            "SA-PAW",
                        ]}
                    >
                        <AdminLayout />
                    </RoleRoute>
                }
            >
                <Route
                    path="/admin/apps"
                    element={<AppsPage />}
                />
            </Route>

            {/* ======================================================
                FALLBACK
                ====================================================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/admin/login"
                        replace
                    />
                }
            />
        </Routes>
    );
}