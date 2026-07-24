import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/Auth/LoginPage";
import { GeneralLayout } from "../components/layout/GeneralLayout";
import { ColaboradorPage } from "../pages/Colaborador";
import { SupervisorHome, RepositorioMarcajes } from "../pages/Supervisor";
import { PublicRoute } from "./PublicRoute";
import { RoleRoute } from "./RoleRoute";

export function AppRouter() {
    return (
        <Routes>
            {/* Login */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />

            {/* Colaborador */}
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

            {/* Supervisor Home */}
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

            {/* Repositorio Marcajes */}
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

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}






// import { Routes, Route, Navigate } from "react-router-dom";
// import { LoginPage } from "../pages/Auth/LoginPage.tsx";
// // import { useAuth } from "../hooks/useAuth.ts";
// import type { JSX } from "react";
// import { GeneralLayout } from "../components/layout/GeneralLayout.tsx";
// import { ColaboradorPage } from "../pages/Colaborador/index.tsx";
// import { useSession } from "../hooks/useSession.ts";
// import { PublicRoute } from "./PublicRoute.tsx";
// import { SupervisorHome } from "../pages/Colaborador/SupervisorHome.tsx";
// import { RepositorioMarcajes } from "../pages/Colaborador/RepositorioMarcajes.tsx";

// function PrivateRoute({ children }: { children: JSX.Element }) {
//     // const { user, loading } = useAuth();
//     const ROLES_PERMITIDOS = ["COL-PMW"];
//     const { empleado, loading } = useSession();

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <span>Cargando...</span>
//             </div>
//         );
//     }

//     if (!empleado) {
//         console.log("no hay empleado")
//         return <Navigate to="/login" replace />;
//     }
//     // if (!empleado.roles.includes("COL-PMW")) {
//     if (!empleado.roles.some(r => ROLES_PERMITIDOS.includes(r.codigo))) {
//         console.log("User roles no válidos:", JSON.stringify(empleado.roles));
//         return <Navigate to="/login" replace />;
//     }

//     return children;
// }

// export function AppRouter() {
//     return (
//         <Routes>
//             <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

//             <Route
//                 path="/colaborador"
//                 element={
//                     <PrivateRoute>
//                         <GeneralLayout>
//                             <ColaboradorPage />
//                         </GeneralLayout>
//                     </PrivateRoute>
//                 }
//             />
//             <Route path="/supervisor-home"
//                 element={
//                     <PrivateRoute>
//                         <GeneralLayout>
//                             <SupervisorHome />
//                         </GeneralLayout>
//                     </PrivateRoute>
//                 }
//             />
//             <Route
//                 path="/supervisor/repositorio-marcajes"
//                 element={
//                     <PrivateRoute>
//                         <GeneralLayout>
//                             <RepositorioMarcajes />
//                         </GeneralLayout>
//                     </PrivateRoute>
//                 }
//             />

//             <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//     );
// }