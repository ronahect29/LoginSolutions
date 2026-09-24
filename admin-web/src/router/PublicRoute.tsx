import type { JSX } from "react";

import { useSession } from "../hooks/useSession";

export function PublicRoute({
    children,
}: {
    children: JSX.Element;
}) {
    const { loading } = useSession();

    if (loading) {
        return <div>Cargando sesión...</div>;
    }

    return children;
}