import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { UserTable } from "./UserTable";
import { FiltroUsuarioComponent } from "./FiltroUsuarioComponent";
import type { Usuario } from "../../models/usuario";
import type { FiltroUsuario } from "../../models/FiltrosUsuario";
import type { FiltroAplicacion } from "../../models/FiltroAplicacion";
import type { FiltroRol } from "../../models/FiltroRol";
import { ES_LOCAL } from "../../utils/utils";
import type { PagedResult } from "../../models/PagedResult";
import { UserCreateWizard } from "./UserCreateWizard";
const initialFilters: FiltroUsuario = {
    nombre: "",
    usuario: "",
    activo: null,
    creadoDesde: "",
    creadoHasta: "",
    modDesde: "",
    modHasta: "",
    aplicaciones: [],
    roles: [],
};


export function UsersPage() {
    type SortState = {
        field: "nombre" | "correo" | "username" | "activo" | "fecha_creacion" | "fecha_modificacion";
        direction: "asc" | "desc";
    };

    const [sort, setSort] = useState<SortState>({
        field: "fecha_creacion",
        direction: "desc",
    });
    const [users, setUsers] = useState<Usuario[]>([]);
    const [filtersApplied, setFiltersApplied] = useState<FiltroUsuario>(initialFilters);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [apps, setApps] = useState<FiltroAplicacion[]>([]);
    const [roles, setRoles] = useState<FiltroRol[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showCreate, setShowCreate] = useState(false);

    // NOTA: Los useEffect son los hooks que permiten ejecutar código al inicio o cuando cambian ciertas dependencias
    useEffect(() => {
        api.get<FiltroAplicacion[]>("/aplicacion/findByActivo/true").then(res => {
            if (ES_LOCAL) console.log("DATA APPS", JSON.stringify(res.data));
            setApps(res.data);
        }).catch(err => {
            console.error("Error cargando aplicaciones", err);
        });
    }, []);


    useEffect(() => {
        fetchUsers(initialFilters, 1);
    }, []);

    async function fetchUsers(filters: FiltroUsuario, pageParam = page) {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post<PagedResult<Usuario>>("/usuarios/findByFilters", {
                nombre: filters.nombre || null,
                usuario: filters.usuario || null,
                activo: filters.activo,
                creadoDesde: filters.creadoDesde || null,
                creadoHasta: filters.creadoHasta || null,
                modDesde: filters.modDesde || null,
                modHasta: filters.modHasta || null,
                appsCodes: filters.aplicaciones.length > 0 ? filters.aplicaciones.map(a => a.codigo) : null,
                rolesCodes: filters.roles.length > 0 ? filters.roles.map(r => r.codigo) : null,
                page: pageParam, pageSize,
                orderBy: sort
            });
            setUsers(res.data.data);
            setTotal(res.data.total);
            setPage(res.data.page);
        } catch (err) {
            console.error("Error cargando usuarios", err);
            setError("No se pudieron cargar los usuarios");
        } finally {
            setLoading(false);
        }
    }

    async function fetchRolesForApps(apps: FiltroAplicacion[]) {
        if (apps.length === 0) {
            setRoles([]);
            return;
        }
        try {
            const res = await api.post<FiltroRol[]>("/rol/findByActivoAndCodigosAplicacionActivo", {
                activo: true,
                appsCodes: apps.map(app => app.codigo)
            });
            setRoles(res.data);
        } catch (err) {
            console.error("Error cargando roles", err);
        }
    }
    async function handleToggleActivo(user: Usuario) {
        const nuevoEstado = !(user.activo === true);
        const ok = window.confirm(`Estás seguro de ${nuevoEstado ? "activar" : "desactivar"} el usuario ${user.nombre}?`);
        if (!ok) return;
        try {
            await api.patch(`/usuarios/changeActivo/${user.id_usuario}`, { activo: nuevoEstado });
            setUsers(prev => prev.map(u => u.id_usuario === user.id_usuario ? { ...u, activo: nuevoEstado } : u));
        } catch (err) {
            console.error("Error cambiando estado activo", err);
            alert("No se pudo cambiar el estado del usuario");
        }
    }
    return (
        <div className="admin-users-page">
            <FiltroUsuarioComponent
                appsOptions={apps}
                rolesOptions={roles}
                onAppsSelectedChange={fetchRolesForApps}
                onSearch={(draft) => { setFiltersApplied(draft); setPage(1); fetchUsers(draft, 1); }}
                onReset={() => {
                    setFiltersApplied(initialFilters);
                    setRoles([]);
                    setPage(1);
                    fetchUsers(initialFilters, 1);
                }} />

            {loading && <p>Cargando usuarios...</p>}
            {error && <p className="error">{error}</p>}
            <div className="user-table-header">
                <h2 className="user-table-title">Usuarios</h2>
                <button className="user-table-create" onClick={() => setShowCreate(true)}>
                    + Nuevo Usuario
                </button>
            </div>
            {
                showCreate && (
                    <UserCreateWizard
                        appsOptions={apps}
                        onClose={() => setShowCreate(false)}
                        onCreated={() => {
                            setShowCreate(false);
                            fetchUsers(filtersApplied, 1);
                        }} />
                )
            }
            <UserTable users={users} page={page} pageSize={pageSize} total={total} sort={sort}
                loading={loading}
                onToggleActivo={handleToggleActivo}
                onPageChange={(newPage) => {
                    setPage(newPage);
                    fetchUsers(filtersApplied, newPage);
                }}
                onSortChange={(newSort) => {
                    setSort(newSort);
                    setPage(1);
                    fetchUsers(filtersApplied, 1)
                }} />
        </div>
    );
}
