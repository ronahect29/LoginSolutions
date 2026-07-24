import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import type { JSX } from "react";

export function RoleRoute({
    children,
    allowedRoles,
}: {
    children: JSX.Element;
    allowedRoles: string[];
}) {
    const { usuario, loading } = useSession();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!usuario) {
        return <Navigate to="/admin/login" replace />;
    }

    const autorizado = usuario.roles.some(
        r => allowedRoles.includes(r.codigo) && r.en_uso
    );

    if (!autorizado) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
