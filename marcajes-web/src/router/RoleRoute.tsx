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
    const { empleado, loading } = useSession();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!empleado) {
        return <Navigate to="/login" replace />;
    }

    const autorizado = empleado.roles.some(
        r => allowedRoles.includes(r.codigo) && r.en_uso
    );

    if (!autorizado) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
