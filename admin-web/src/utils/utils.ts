import type { Rol } from "../models/rol";

export const ES_LOCAL = import.meta.env.VITE_MODO_LOCAL === 'true';

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}
export function getHomeByRoles(roles: Rol[]): string {
  if (roles.some(r => r.codigo === "SA-PAW" && r.en_uso)) {
    return "home-admin";
  }

  return "login";
}