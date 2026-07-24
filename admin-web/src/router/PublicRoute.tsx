// import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import type { JSX } from "react";
// import { type Rol } from "../models/rol";
export function PublicRoute({ children }: { children: JSX.Element }) {
  const { usuario, loading } = useSession();
  if (loading) {
    return <div>Cargando Sesión...</div>
  }
  // if (usuario) {
  //   const home = getHomeByRoles(usuario.roles);
  //   if (location.pathname.endsWith(home)) {
  //     return children;
  //   }

  //   return <Navigate to={home} replace />;
  // }
  // if (usuario) {
  //   const home = getHomeByRoles(usuario.roles)
  //   return <Navigate to={home} replace />
  // }
  return children;
}