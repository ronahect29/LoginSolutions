import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import type { JSX } from "react";
import { type Rol } from "../models/rol";
export function PublicRoute({ children }: { children: JSX.Element }) {
  const { empleado, loading } = useSession();
  if (loading) {
    return <div>Cargando Sesión...</div>
  }
  if (empleado) {
    const home = getHomeByRoles(empleado.roles)
    return <Navigate to={home} replace />
  }
  return children;
}
function getHomeByRoles(roles: Rol[]): string {
  if (roles.some(r => r.codigo === "ADM-PMW" && r.en_uso)) {
    return "/admin";
  }

  if (roles.some(r => r.codigo === "SUP-PMW" && r.en_uso)) {
    return "/supervisor-home";
  }

  if (roles.some(r => r.codigo === "COL-PMW" && r.en_uso)) {
    return "/colaborador";
  }

  return "/login";
}