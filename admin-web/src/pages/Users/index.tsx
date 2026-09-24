import {
    Plus,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";

import type { FiltroAplicacion } from "../../models/FiltroAplicacion";
import type { FiltroRol } from "../../models/FiltroRol";
import type { FiltroUsuario } from "../../models/FiltrosUsuario";
import type { PagedResult } from "../../models/PagedResult";
import type { Usuario } from "../../models/usuario";
import { api } from "../../services/api";
import "../../styles/UsersPage.css";
import { ES_LOCAL } from "../../utils/utils";
import { FiltroUsuarioComponent } from "./FiltroUsuarioComponent";
import { UserCreateWizard } from "./UserCreateWizard";
import { UserTable } from "./UserTable";

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
        field:
            | "nombre"
            | "correo"
            | "username"
            | "activo"
            | "fecha_creacion"
            | "fecha_modificacion";
        direction: "asc" | "desc";
    };

    const [sort, setSort] =
        useState<SortState>({
            field: "fecha_creacion",
            direction: "desc",
        });

    const [users, setUsers] =
        useState<Usuario[]>([]);

    const [
        filtersApplied,
        setFiltersApplied,
    ] =
        useState<FiltroUsuario>(
            initialFilters
        );

    const [page, setPage] =
        useState(1);

    const [pageSize] =
        useState(10);

    const [total, setTotal] =
        useState(0);

    const [apps, setApps] =
        useState<FiltroAplicacion[]>([]);

    const [roles, setRoles] =
        useState<FiltroRol[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [showCreate, setShowCreate] =
        useState(false);

    useEffect(() => {
        api.get<FiltroAplicacion[]>(
            "/aplicacion/findByActivo/true"
        )
            .then((res) => {
                if (ES_LOCAL) {
                    console.log(
                        "DATA APPS",
                        JSON.stringify(
                            res.data
                        )
                    );
                }

                setApps(res.data);
            })
            .catch((err) => {
                console.error(
                    "Error cargando aplicaciones",
                    err
                );
            });
    }, []);

    useEffect(() => {
        void fetchUsers(
            initialFilters,
            1
        );
    }, []);

    async function fetchUsers(
        filters: FiltroUsuario,
        pageParam = page,
        sortParam = sort
    ) {
        setLoading(true);
        setError(null);

        try {
            const res =
                await api.post<
                    PagedResult<Usuario>
                >(
                    "/usuarios/findByFilters",
                    {
                        nombre:
                            filters.nombre ||
                            null,

                        usuario:
                            filters.usuario ||
                            null,

                        activo:
                            filters.activo,

                        creadoDesde:
                            filters.creadoDesde ||
                            null,

                        creadoHasta:
                            filters.creadoHasta ||
                            null,

                        modDesde:
                            filters.modDesde ||
                            null,

                        modHasta:
                            filters.modHasta ||
                            null,

                        appsCodes:
                            filters
                                .aplicaciones
                                .length > 0
                                ? filters.aplicaciones.map(
                                      (app) =>
                                          app.codigo
                                  )
                                : null,

                        rolesCodes:
                            filters.roles
                                .length > 0
                                ? filters.roles.map(
                                      (rol) =>
                                          rol.codigo
                                  )
                                : null,

                        page: pageParam,
                        pageSize,
                        orderBy:
                            sortParam,
                    }
                );

            setUsers(
                res.data.data
            );

            setTotal(
                res.data.total
            );

            setPage(
                res.data.page
            );
        } catch (err) {
            console.error(
                "Error cargando usuarios",
                err
            );

            setError(
                "No se pudieron cargar los usuarios."
            );
        } finally {
            setLoading(false);
        }
    }

    async function fetchRolesForApps(
        selectedApps:
            FiltroAplicacion[]
    ) {
        if (
            selectedApps.length === 0
        ) {
            setRoles([]);
            return;
        }

        try {
            const res =
                await api.post<
                    FiltroRol[]
                >(
                    "/rol/findByActivoAndCodigosAplicacionActivo",
                    {
                        activo: true,

                        appsCodes:
                            selectedApps.map(
                                (app) =>
                                    app.codigo
                            ),
                    }
                );

            setRoles(
                res.data
            );
        } catch (err) {
            console.error(
                "Error cargando roles",
                err
            );

            setRoles([]);
        }
    }

    async function handleToggleActivo(
        user: Usuario
    ) {
        const nuevoEstado =
            !user.activo;

        const accion =
            nuevoEstado
                ? "habilitar"
                : "deshabilitar";

        const ok =
            window.confirm(
                `¿Confirmas que deseas ${accion} al usuario ${user.nombre}?`
            );

        if (!ok) {
            return;
        }

        try {
            await api.patch(
                `/usuarios/changeActivo/${user.id_usuario}`,
                {
                    activo:
                        nuevoEstado,
                }
            );

            setUsers((prev) =>
                prev.map(
                    (usuario) =>
                        usuario.id_usuario ===
                        user.id_usuario
                            ? {
                                  ...usuario,
                                  activo:
                                      nuevoEstado,
                              }
                            : usuario
                )
            );
        } catch (err) {
            console.error(
                "Error cambiando estado del usuario",
                err
            );

            window.alert(
                "No se pudo cambiar el estado del usuario."
            );
        }
    }

    function handleSearch(
        draft: FiltroUsuario
    ) {
        setFiltersApplied(
            draft
        );

        setPage(1);

        void fetchUsers(
            draft,
            1
        );
    }

    function handleReset() {
        setFiltersApplied(
            initialFilters
        );

        setRoles([]);

        setPage(1);

        void fetchUsers(
            initialFilters,
            1
        );
    }

    return (
        <section className="users-page">
            {/* ======================================================
                ENCABEZADO
                ====================================================== */}

            <div className="users-page-heading">
                <span className="users-page-kicker">
                    Gestión de usuarios
                </span>

                <div className="users-page-heading-row">
                    <div className="users-page-heading-text">
                        <h1>
                            Usuarios
                        </h1>

                        <p>
                            Gestiona las cuentas,
                            roles, accesos y estado
                            de los usuarios del
                            sistema.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="users-create-button"
                        onClick={() =>
                            setShowCreate(
                                true
                            )
                        }
                    >
                        <Plus
                            size={18}
                        />

                        <span>
                            Nuevo usuario
                        </span>
                    </button>
                </div>
            </div>

            {/* ======================================================
                FILTROS
                ====================================================== */}

            <FiltroUsuarioComponent
                appsOptions={apps}
                rolesOptions={roles}
                onAppsSelectedChange={
                    fetchRolesForApps
                }
                onSearch={
                    handleSearch
                }
                onReset={
                    handleReset
                }
            />

            {/* ======================================================
                ERROR
                ====================================================== */}

            {error && (
                <div className="users-error">
                    {error}
                </div>
            )}

            {/* ======================================================
                LISTADO
                ====================================================== */}

            <div className="users-list-heading">
                <div>
                    <h2>
                        Usuarios registrados
                    </h2>

                    <p>
                        {total === 1
                            ? "1 usuario encontrado"
                            : `${total} usuarios encontrados`}
                    </p>
                </div>
            </div>

            <UserTable
                users={users}
                page={page}
                pageSize={
                    pageSize
                }
                total={total}
                sort={sort}
                loading={loading}
                onToggleActivo={
                    handleToggleActivo
                }
                onPageChange={(
                    newPage
                ) => {
                    setPage(
                        newPage
                    );

                    void fetchUsers(
                        filtersApplied,
                        newPage
                    );
                }}
                onSortChange={(
                    newSort
                ) => {
                    setSort(
                        newSort
                    );

                    setPage(1);

                    void fetchUsers(
                        filtersApplied,
                        1,
                        newSort
                    );
                }}
            />

            {/* ======================================================
                CREAR USUARIO
                ====================================================== */}

            {showCreate && (
                <UserCreateWizard
                    appsOptions={
                        apps
                    }
                    onClose={() =>
                        setShowCreate(
                            false
                        )
                    }
                    onCreated={() => {
                        setShowCreate(
                            false
                        );

                        setPage(1);

                        void fetchUsers(
                            filtersApplied,
                            1
                        );
                    }}
                />
            )}
        </section>
    );
}