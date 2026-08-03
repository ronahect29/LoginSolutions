import { NavLink } from "react-router-dom";

import { useSession } from "../../hooks/useSession";

import "../../styles/Header.css";

export function Header() {
    const { empleado, logout } = useSession();

    const isSupervisor = empleado?.roles.some(
        (rol) =>
            rol.codigo === "SUP-PMW" &&
            rol.en_uso
    );

    const iniciales =
        empleado?.nombre
            ?.split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((palabra) => palabra.charAt(0))
            .join("")
            .toUpperCase() || "US";

    function obtenerClaseEnlace(
        isActive: boolean
    ): string {
        return [
            "app-header-link",
            isActive
                ? "app-header-link-active"
                : ""
        ]
            .filter(Boolean)
            .join(" ");
    }

    return (
        <header className="app-header">
            <div className="app-header-brand">
                <div
                    className="app-header-logo"
                    aria-hidden="true"
                >
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M7 3v3M17 3v3M4.5 8.5h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        <path
                            d="m8.5 14 2.1 2.1 4.9-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div className="app-header-brand-text">
                    <span className="app-header-title">
                        Portal de Marcajes
                    </span>

                    <span className="app-header-subtitle">
                        Control y gestión de asistencia
                    </span>
                </div>
            </div>

            {isSupervisor && (
                <nav
                    className="app-header-nav"
                    aria-label="Navegación principal"
                >
                    <NavLink
                        to="/supervisor-home"
                        end
                        className={({ isActive }) =>
                            obtenerClaseEnlace(isActive)
                        }
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                d="m3 11 9-8 9 8"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <path
                                d="M5.5 10v10h13V10M9.5 20v-6h5v6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span>Inicio</span>
                    </NavLink>

                    <NavLink
                        to="/supervisor/equipo"
                        className={({ isActive }) =>
                            obtenerClaseEnlace(isActive)
                        }
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle
                                cx="9"
                                cy="8"
                                r="3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M3.5 19c.4-3.3 2.3-5 5.5-5s5.1 1.7 5.5 5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <circle
                                cx="17"
                                cy="9"
                                r="2.4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M15.5 14.5c2.8-.5 4.6 1 5 4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>

                        <span>Equipo</span>
                    </NavLink>

                    <NavLink
                        to="/supervisor/repositorio-marcajes"
                        className={({ isActive }) =>
                            obtenerClaseEnlace(isActive)
                        }
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                d="M4 5.5A2.5 2.5 0 0 1 6.5 3H10l2 2h5.5A2.5 2.5 0 0 1 20 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-12Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <path
                                d="M8 11h8M8 14h6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>

                        <span>Marcajes</span>
                    </NavLink>

                    <NavLink
                        to="/supervisor/sucursales"
                        className={({ isActive }) =>
                            obtenerClaseEnlace(isActive)
                        }
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <circle
                                cx="12"
                                cy="9"
                                r="2.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                        </svg>

                        <span>Sucursales</span>
                    </NavLink>
                </nav>
            )}

            <div className="app-header-user">
                {empleado && (
                    <div className="app-header-profile">
                        <div
                            className="app-header-avatar"
                            aria-hidden="true"
                        >
                            {iniciales}
                        </div>

                        <div className="app-header-user-data">
                            <span className="app-header-name">
                                {empleado.nombre}
                            </span>

                            <span className="app-header-role">
                                {isSupervisor
                                    ? "Supervisor"
                                    : "Colaborador"}
                            </span>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={logout}
                    className="app-header-logout"
                    aria-label="Cerrar sesión"
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M10 17l5-5-5-5M15 12H3M14 4h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <span>Cerrar sesión</span>
                </button>
            </div>
        </header>
    );
}