import "../../styles/Header.css";
import { useSession } from "../../hooks/useSession";
import { Link } from "react-router-dom";

export function Header() {
  const { empleado, logout } = useSession();
  const isSupervisor = empleado?.roles.some(
    r => r.codigo === "SUP-PMW" && r.en_uso
  );
  return (
    <header className="app-header">
      <h1 className="app-header-title">Portal de Marcajes</h1>

      <nav className="app-header-nav">
        {isSupervisor && (
          <>
            <Link to="/supervisor-home">Inicio</Link>
            <Link to="/supervisor/equipo">Equipo</Link>
            <Link to="/supervisor/reportes">Reportes</Link>
          </>
        )}

        {/* {isColaborador && (
          <Link to="/colaborador">Mis marcajes</Link>
        )} */}
      </nav>
      <div className="app-header-user">
        {empleado && (
          <span className="app-header-name">
            {empleado.nombre}
          </span>
        )}

        <button
          onClick={logout}
          className="app-header-logout"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}



// import { useAuth } from "../../hooks/useAuth";
/*import { useSession } from "../../hooks/useSession";

export function Header() {
    const { empleado, logout } = useSession();

    return (
        <header className="bg-white shadow rounded-xl px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">PORTAL DE MARCAJES</h1>
            <div className="flex items-center gap-4">
                {empleado && (
                    <span className="text-sm text-gray-600">
                        {empleado.nombre}
                    </span>
                )}
                <button
                    onClick={logout}
                    className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                >
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}
*/