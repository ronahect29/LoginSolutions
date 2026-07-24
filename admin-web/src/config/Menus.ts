import type { MenuItem } from "../models/MenuItem";
import type { Rol } from "../models/rol";

export const roleMenus: Record<string, MenuItem[]> = {
    "SA-PAW": [
        { label: "Dashboard", path: "/admin/home-admin" },
        { label: "Usuarios", path: "/admin/usuarios" },
        { label: "Roles", path: "/admin/roles" },
        // { label: "Aplicaciones", path: "/apps" },
    ],
};
export function buildMenuFromRoles(
    roles: Rol[]
): MenuItem[] {
    const menuMap = new Map<string, MenuItem>();

    roles
        .filter(r => r.activo && r.en_uso)
        .forEach(role => {
            const items = roleMenus[role.codigo];
            if (!items) return;

            items.forEach(item => {
                menuMap.set(item.path, item);
            });
        });

    return Array.from(menuMap.values());
}