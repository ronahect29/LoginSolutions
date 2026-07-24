import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { buildMenuFromRoles } from "../../config/Menus";
import { useSession } from "../../hooks/useSession";

export function AdminLayout() {
    const { usuario } = useSession();
    const menuItems = usuario ? buildMenuFromRoles(usuario.roles) : []
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