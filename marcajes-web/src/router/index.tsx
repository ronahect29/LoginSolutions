import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../pages/Auth/LoginPage";
import { ColaboradorPage } from "../pages/Colaborador";

import {
    EquipoPage,
    RepositorioMarcajes,
    SucursalesPage,
    SupervisorHome
} from "../pages/Supervisor";

import { GeneralLayout } from "../components/layout/GeneralLayout";
import { PublicRoute } from "./PublicRoute";
import { RoleRoute } from "./RoleRoute";

export function AppRouter() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />

            <Route
                path="/colaborador"
                element={
                    <RoleRoute allowedRoles={["COL-PMW"]}>
                        <GeneralLayout>
                            <ColaboradorPage />
                        </GeneralLayout>
                    </RoleRoute>
                }
            />

            <Route
                path="/supervisor-home"
                element={
                    <RoleRoute allowedRoles={["SUP-PMW"]}>
                        <GeneralLayout>
                            <SupervisorHome />
                        </GeneralLayout>
                    </RoleRoute>
                }
            />

            <Route
                path="/supervisor/equipo"
                element={
                    <RoleRoute allowedRoles={["SUP-PMW"]}>
                        <GeneralLayout>
                            <EquipoPage />
                        </GeneralLayout>
                    </RoleRoute>
                }
            />

            <Route
                path="/supervisor/repositorio-marcajes"
                element={
                    <RoleRoute allowedRoles={["SUP-PMW"]}>
                        <GeneralLayout>
                            <RepositorioMarcajes />
                        </GeneralLayout>
                    </RoleRoute>
                }
            />

            <Route
                path="/supervisor/sucursales"
                element={
                    <RoleRoute allowedRoles={["SUP-PMW"]}>
                        <GeneralLayout>
                            <SucursalesPage />
                        </GeneralLayout>
                    </RoleRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
}