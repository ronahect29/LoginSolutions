import type { MenuItem } from "../models/MenuItem";
import type { Rol } from "../models/rol";

export const roleMenus:
    Record<
        string,
        MenuItem[]
    > = {
    "SA-PAW": [
        {
            label: "Dashboard",
            path: "/admin/home-admin",
        },
        {
            label: "Usuarios",
            path: "/admin/usuarios",
        },
        {
            label: "Roles",
            path: "/admin/roles",
        },
        {
            label: "Aplicaciones",
            path: "/admin/apps",
        },
    ],
};

export function buildMenuFromRoles(
    roles: Rol[]
): MenuItem[] {
    const menuMap =
        new Map<
            string,
            MenuItem
        >();

    roles
        .filter(
            (rol) =>
                rol.activo &&
                rol.en_uso
        )
        .forEach((rol) => {
            const items =
                roleMenus[
                    rol.codigo
                ];

            if (!items) {
                return;
            }

            items.forEach(
                (item) => {
                    menuMap.set(
                        item.path,
                        item
                    );
                }
            );
        });

    return Array.from(
        menuMap.values()
    );
}