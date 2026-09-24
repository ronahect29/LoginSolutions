import {
    ChevronDown,
    ChevronUp,
    RotateCcw,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import {
    useState,
} from "react";

import type { FiltroAplicacion } from "../../models/FiltroAplicacion";
import type { FiltroRol } from "../../models/FiltroRol";
import type { FiltroUsuario } from "../../models/FiltrosUsuario";
import "../../styles/FiltroUsuario.css";

interface Props {
    appsOptions:
        FiltroAplicacion[];

    rolesOptions:
        FiltroRol[];

    onAppsSelectedChange: (
        apps: FiltroAplicacion[]
    ) => void | Promise<void>;

    onSearch: (
        filters: FiltroUsuario
    ) => void;

    onReset: () => void;
}

const initialFilters:
    FiltroUsuario = {
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

export function FiltroUsuarioComponent({
    appsOptions,
    rolesOptions,
    onAppsSelectedChange,
    onSearch,
    onReset,
}: Props) {
    const [
        filters,
        setFilters,
    ] =
        useState<FiltroUsuario>(
            initialFilters
        );

    const [
        showAdvanced,
        setShowAdvanced,
    ] =
        useState(false);

    function updateField<
        K extends keyof FiltroUsuario,
    >(
        field: K,
        value: FiltroUsuario[K]
    ) {
        setFilters(
            (prev) => ({
                ...prev,
                [field]:
                    value,
            })
        );
    }

    function handleAppToggle(
        app: FiltroAplicacion
    ) {
        const exists =
            filters.aplicaciones.some(
                (selected) =>
                    selected.codigo ===
                    app.codigo
            );

        const nuevasApps =
            exists
                ? filters.aplicaciones.filter(
                      (selected) =>
                          selected.codigo !==
                          app.codigo
                  )
                : [
                      ...filters.aplicaciones,
                      app,
                  ];

        setFilters(
            (prev) => ({
                ...prev,
                aplicaciones:
                    nuevasApps,

                roles: [],
            })
        );

        void onAppsSelectedChange(
            nuevasApps
        );
    }

    function handleRoleToggle(
        role: FiltroRol
    ) {
        const exists =
            filters.roles.some(
                (selected) =>
                    selected.codigo ===
                    role.codigo
            );

        const nuevosRoles =
            exists
                ? filters.roles.filter(
                      (selected) =>
                          selected.codigo !==
                          role.codigo
                  )
                : [
                      ...filters.roles,
                      role,
                  ];

        updateField(
            "roles",
            nuevosRoles
        );
    }

    function handleReset() {
        setFilters(
            initialFilters
        );

        setShowAdvanced(
            false
        );

        void onAppsSelectedChange(
            []
        );

        onReset();
    }

    function handleEstadoChange(
        value: string
    ) {
        if (value === "true") {
            updateField(
                "activo",
                true
            );

            return;
        }

        if (value === "false") {
            updateField(
                "activo",
                false
            );

            return;
        }

        updateField(
            "activo",
            null
        );
    }

    return (
        <section className="users-filter-card">
            <div className="users-filter-header">
                <div>
                    <h2>
                        Buscar usuarios
                    </h2>

                    <p>
                        Utiliza uno o
                        varios filtros
                        para localizar
                        usuarios.
                    </p>
                </div>
            </div>

            {/* ======================================================
                FILTROS PRINCIPALES
                ====================================================== */}

            <div className="users-filter-grid">
                <div className="users-filter-field">
                    <label
                        htmlFor="filtro-nombre"
                    >
                        Nombre
                    </label>

                    <input
                        id="filtro-nombre"
                        type="text"
                        value={
                            filters.nombre
                        }
                        placeholder="Buscar por nombre"
                        onChange={(
                            event
                        ) =>
                            updateField(
                                "nombre",
                                event
                                    .target
                                    .value
                            )
                        }
                    />
                </div>

                <div className="users-filter-field">
                    <label
                        htmlFor="filtro-correo"
                    >
                        Correo
                    </label>

                    <input
                        id="filtro-correo"
                        type="text"
                        value={
                            filters.usuario
                        }
                        placeholder="correo@ejemplo.com"
                        onChange={(
                            event
                        ) =>
                            updateField(
                                "usuario",
                                event
                                    .target
                                    .value
                            )
                        }
                    />
                </div>

                <div className="users-filter-field">
                    <label
                        htmlFor="filtro-estado"
                    >
                        Estado
                    </label>

                    <select
                        id="filtro-estado"
                        value={
                            filters.activo ===
                            null
                                ? ""
                                : String(
                                      filters.activo
                                  )
                        }
                        onChange={(
                            event
                        ) =>
                            handleEstadoChange(
                                event
                                    .target
                                    .value
                            )
                        }
                    >
                        <option value="">
                            Todos
                        </option>

                        <option value="true">
                            Activos
                        </option>

                        <option value="false">
                            Inactivos
                        </option>
                    </select>
                </div>
            </div>

            {/* ======================================================
                FILTROS AVANZADOS
                ====================================================== */}

            {showAdvanced && (
                <div className="users-advanced-filters">
                    <div className="users-filter-divider" />

                    <div className="users-advanced-title">
                        <SlidersHorizontal
                            size={16}
                        />

                        <span>
                            Filtros avanzados
                        </span>
                    </div>

                    <div className="users-advanced-grid">
                        <div className="users-filter-field">
                            <label>
                                Aplicaciones
                            </label>

                            <div className="users-filter-pills">
                                {appsOptions.length >
                                0 ? (
                                    appsOptions.map(
                                        (
                                            app
                                        ) => {
                                            const selected =
                                                filters.aplicaciones.some(
                                                    (
                                                        current
                                                    ) =>
                                                        current.codigo ===
                                                        app.codigo
                                                );

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        app.codigo
                                                    }
                                                    className={
                                                        selected
                                                            ? "users-filter-pill selected"
                                                            : "users-filter-pill"
                                                    }
                                                    onClick={() =>
                                                        handleAppToggle(
                                                            app
                                                        )
                                                    }
                                                >
                                                    {
                                                        app.codigo
                                                    }
                                                </button>
                                            );
                                        }
                                    )
                                ) : (
                                    <span className="users-filter-empty">
                                        No hay
                                        aplicaciones
                                        disponibles.
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="users-filter-field">
                            <label>
                                Roles
                            </label>

                            {filters
                                .aplicaciones
                                .length ===
                            0 ? (
                                <div className="users-roles-placeholder">
                                    Selecciona una
                                    aplicación para
                                    ver sus roles.
                                </div>
                            ) : rolesOptions.length >
                              0 ? (
                                <div className="users-filter-pills">
                                    {rolesOptions.map(
                                        (
                                            role
                                        ) => {
                                            const selected =
                                                filters.roles.some(
                                                    (
                                                        current
                                                    ) =>
                                                        current.codigo ===
                                                        role.codigo
                                                );

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        role.codigo
                                                    }
                                                    className={
                                                        selected
                                                            ? "users-filter-pill selected"
                                                            : "users-filter-pill"
                                                    }
                                                    onClick={() =>
                                                        handleRoleToggle(
                                                            role
                                                        )
                                                    }
                                                >
                                                    {
                                                        role.codigo
                                                    }
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                <div className="users-roles-placeholder">
                                    No hay roles
                                    disponibles para
                                    las aplicaciones
                                    seleccionadas.
                                </div>
                            )}
                        </div>

                        <div className="users-filter-field">
                            <label
                                htmlFor="creado-desde"
                            >
                                Creación desde
                            </label>

                            <input
                                id="creado-desde"
                                type="date"
                                value={
                                    filters.creadoDesde
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "creadoDesde",
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>

                        <div className="users-filter-field">
                            <label
                                htmlFor="creado-hasta"
                            >
                                Creación hasta
                            </label>

                            <input
                                id="creado-hasta"
                                type="date"
                                value={
                                    filters.creadoHasta
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "creadoHasta",
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>

                        <div className="users-filter-field">
                            <label
                                htmlFor="mod-desde"
                            >
                                Modificación desde
                            </label>

                            <input
                                id="mod-desde"
                                type="date"
                                value={
                                    filters.modDesde
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "modDesde",
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>

                        <div className="users-filter-field">
                            <label
                                htmlFor="mod-hasta"
                            >
                                Modificación hasta
                            </label>

                            <input
                                id="mod-hasta"
                                type="date"
                                value={
                                    filters.modHasta
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "modHasta",
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================
                ACCIONES
                ====================================================== */}

            <div className="users-filter-actions">
                <button
                    type="button"
                    className="users-more-filters"
                    onClick={() =>
                        setShowAdvanced(
                            (prev) =>
                                !prev
                        )
                    }
                >
                    {showAdvanced ? (
                        <ChevronUp
                            size={16}
                        />
                    ) : (
                        <ChevronDown
                            size={16}
                        />
                    )}

                    <span>
                        {showAdvanced
                            ? "Ocultar filtros"
                            : "Más filtros"}
                    </span>
                </button>

                <div className="users-filter-actions-right">
                    <button
                        type="button"
                        className="users-filter-reset"
                        onClick={
                            handleReset
                        }
                    >
                        <RotateCcw
                            size={15}
                        />

                        <span>
                            Limpiar
                        </span>
                    </button>

                    <button
                        type="button"
                        className="users-filter-search"
                        onClick={() =>
                            onSearch(
                                filters
                            )
                        }
                    >
                        <Search
                            size={15}
                        />

                        <span>
                            Buscar
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}