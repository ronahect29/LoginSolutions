import { Outlet } from "react-router-dom";

import { buildMenuFromRoles } from "../../config/Menus";
import { useSession } from "../../hooks/useSession";
import { Header } from "./Header";

export function AdminLayout() {
    const { usuario } = useSession();

    const menuItems = usuario
        ? buildMenuFromRoles(usuario.roles)
        : [];

    return (
        <div className="layout">
            <Header
                appTitle="Plataforma de Administración Web"
                menuItems={menuItems}
            />

            <main className="layout-content">
                <Outlet />
            </main>
        </div>
    );
}