import { ClipboardList, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSession } from "../../hooks/useSession";
import type { MenuItem } from "../../models/MenuItem";
import "../../styles/Headers.css";
import { SideMenu } from "./SideMenu";

interface HeaderProps {
    appTitle: string;
    menuItems: MenuItem[];
}

function obtenerIniciales(nombre: string): string {
    const partes = nombre
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (partes.length === 0) {
        return "AD";
    }

    if (partes.length === 1) {
        return partes[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
}

export function Header({
    appTitle,
    menuItems,
}: HeaderProps) {
    const [open, setOpen] = useState(false);

    const { usuario, logout } = useSession();
    const navigate = useNavigate();

    const nombreUsuario =
        usuario?.nombre?.trim() || "Administrador";

    const iniciales = obtenerIniciales(nombreUsuario);

    function handleLogout() {
        logout();

        navigate("/admin/login", {
            replace: true,
        });
    }

    return (
        <>
            <header className="app-header">
                <div className="header-left">
                    <button
                        type="button"
                        className="menu-btn"
                        onClick={() => setOpen(true)}
                        aria-label="Abrir menú de navegación"
                        title="Abrir menú"
                    >
                        <Menu size={22} />
                    </button>
                </div>

                <div className="header-center">
                    <div className="header-brand-icon">
                        <ClipboardList size={21} />
                    </div>

                    <div className="header-brand-text">
                        <strong>{appTitle}</strong>

                        <span>
                            Gestión centralizada del sistema
                        </span>
                    </div>
                </div>

                <div className="header-right">
                    <div className="header-user">
                        <div className="header-user-avatar">
                            {iniciales}
                        </div>

                        <div className="header-user-text">
                            <strong>
                                {nombreUsuario}
                            </strong>

                            <span>
                                Administrador
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Cerrar sesión"
                        aria-label="Cerrar sesión"
                    >
                        <LogOut size={16} />

                        <span>
                            Cerrar sesión
                        </span>
                    </button>
                </div>
            </header>

            <SideMenu
                open={open}
                items={menuItems}
                onClose={() => setOpen(false)}
            />
        </>
    );
}