import {
    Pencil,
    Plus,
    RotateCcw,
    Search,
    ShieldCheck,
    UserCheck,
    UserX,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";

import {
    useRoles,
} from "../../hooks/useRoles";
import type {
    Role,
} from "../../services/roles.service";
import "../../styles/RolesPage.css";
import {
    RoleForm,
} from "./RoleForm";

export function RolesPage() {
    const {
        items,
        loading,
        error,
        create,
        update,
        changeActivo,
    } =
        useRoles();

    const [
        editingId,
        setEditingId,
    ] =
        useState<
            number | null
        >(null);

    const [
        showForm,
        setShowForm,
    ] =
        useState(false);

    const [
        search,
        setSearch,
    ] =
        useState("");

    const [
        applicationFilter,
        setApplicationFilter,
    ] =
        useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] =
        useState("");

    const [
        actionError,
        setActionError,
    ] =
        useState<
            string | null
        >(null);

    const editingRole =
        items.find(
            (role) =>
                role.id_rol ===
                editingId
        ) || null;

    // ======================================================
    // APLICACIONES PARA FILTRO
    // ======================================================

    const applications =
        useMemo(() => {
            const map =
                new Map<
                    string,
                    {
                        codigo: string;
                        nombre: string;
                    }
                >();

            items.forEach(
                (role) => {
                    map.set(
                        role
                            .aplicacion
                            .codigo,
                        {
                            codigo:
                                role
                                    .aplicacion
                                    .codigo,

                            nombre:
                                role
                                    .aplicacion
                                    .nombre,
                        }
                    );
                }
            );

            return Array.from(
                map.values()
            ).sort(
                (a, b) =>
                    a.nombre.localeCompare(
                        b.nombre,
                        "es"
                    )
            );
        }, [items]);

    // ======================================================
    // FILTROS
    // ======================================================

    const filteredItems =
        useMemo(() => {
            const text =
                search
                    .trim()
                    .toLowerCase();

            return items.filter(
                (role) => {
                    const matchesText =
                        !text ||
                        role.nombre
                            .toLowerCase()
                            .includes(
                                text
                            ) ||
                        role.codigo
                            .toLowerCase()
                            .includes(
                                text
                            ) ||
                        role.descripcion
                            .toLowerCase()
                            .includes(
                                text
                            ) ||
                        role.aplicacion.nombre
                            .toLowerCase()
                            .includes(
                                text
                            ) ||
                        role.aplicacion.codigo
                            .toLowerCase()
                            .includes(
                                text
                            );

                    const matchesApp =
                        !applicationFilter ||
                        role
                            .aplicacion
                            .codigo ===
                            applicationFilter;

                    const matchesStatus =
                        !statusFilter ||
                        (
                            statusFilter ===
                            "activo"
                                ? role.activo
                                : !role.activo
                        );

                    return (
                        matchesText &&
                        matchesApp &&
                        matchesStatus
                    );
                }
            );
        }, [
            items,
            search,
            applicationFilter,
            statusFilter,
        ]);

    // ======================================================
    // FORMULARIO
    // ======================================================

    function openCreate() {
        setEditingId(
            null
        );

        setActionError(
            null
        );

        setShowForm(
            true
        );
    }

    function openEdit(
        role: Role
    ) {
        setEditingId(
            role.id_rol
        );

        setActionError(
            null
        );

        setShowForm(
            true
        );
    }

    function closeForm() {
        setShowForm(
            false
        );

        setEditingId(
            null
        );
    }

    // ======================================================
    // CAMBIO DE ESTADO
    // ======================================================

    async function handleToggleActivo(
        role: Role
    ) {
        const nuevoEstado =
            !role.activo;

        const accion =
            nuevoEstado
                ? "habilitar"
                : "deshabilitar";

        const ok =
            window.confirm(
                `¿Confirmas que deseas ${accion} el rol "${role.nombre}"?`
            );

        if (!ok) {
            return;
        }

        setActionError(
            null
        );

        try {
            await changeActivo(
                role.id_rol,
                nuevoEstado
            );
        } catch (err) {
            console.error(
                "Error cambiando estado del rol",
                err
            );

            setActionError(
                "No se pudo cambiar el estado del rol."
            );
        }
    }

    // ======================================================
    // LIMPIAR FILTROS
    // ======================================================

    function clearFilters() {
        setSearch("");
        setApplicationFilter(
            ""
        );
        setStatusFilter(
            ""
        );
    }

    return (
        <section className="roles-page">
            {/* ======================================================
                ENCABEZADO
                ====================================================== */}

            <div className="roles-page-heading">
                <span className="roles-page-kicker">
                    Gestión de roles
                </span>

                <div className="roles-page-heading-row">
                    <div className="roles-page-heading-text">
                        <h1>
                            Roles
                        </h1>

                        <p>
                            Administra los
                            perfiles de acceso
                            disponibles para
                            cada aplicación
                            del sistema.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="roles-create-button"
                        onClick={
                            openCreate
                        }
                    >
                        <Plus
                            size={
                                18
                            }
                        />

                        <span>
                            Nuevo rol
                        </span>
                    </button>
                </div>
            </div>

            {/* ======================================================
                FILTROS
                ====================================================== */}

            <section className="roles-filter-card">
                <div className="roles-filter-header">
                    <h2>
                        Buscar roles
                    </h2>

                    <p>
                        Filtra los
                        perfiles por
                        nombre, código,
                        aplicación o
                        estado.
                    </p>
                </div>

                <div className="roles-filter-grid">
                    <div className="roles-field">
                        <label htmlFor="roles-search">
                            Nombre o código
                        </label>

                        <div className="roles-search-field">
                            <Search
                                size={
                                    15
                                }
                            />

                            <input
                                id="roles-search"
                                type="text"
                                value={
                                    search
                                }
                                placeholder="Ej. Supervisor o SUP-PMW"
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="roles-field">
                        <label htmlFor="roles-app">
                            Aplicación
                        </label>

                        <select
                            id="roles-app"
                            value={
                                applicationFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setApplicationFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                        >
                            <option value="">
                                Todas las
                                aplicaciones
                            </option>

                            {applications.map(
                                (
                                    app
                                ) => (
                                    <option
                                        key={
                                            app.codigo
                                        }
                                        value={
                                            app.codigo
                                        }
                                    >
                                        {
                                            app.nombre
                                        }{" "}
                                        ({
                                            app.codigo
                                        })
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="roles-field">
                        <label htmlFor="roles-status">
                            Estado
                        </label>

                        <select
                            id="roles-status"
                            value={
                                statusFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setStatusFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                        >
                            <option value="">
                                Todos
                            </option>

                            <option value="activo">
                                Activos
                            </option>

                            <option value="inactivo">
                                Inactivos
                            </option>
                        </select>
                    </div>
                </div>

                <div className="roles-filter-actions">
                    <button
                        type="button"
                        className="roles-clear-button"
                        onClick={
                            clearFilters
                        }
                    >
                        <RotateCcw
                            size={
                                14
                            }
                        />

                        Limpiar
                    </button>
                </div>
            </section>

            {/* ======================================================
                ERRORES
                ====================================================== */}

            {(error ||
                actionError) && (
                <div className="roles-page-error">
                    {error ||
                        actionError}
                </div>
            )}

            {/* ======================================================
                ENCABEZADO LISTADO
                ====================================================== */}

            <div className="roles-list-heading">
                <div>
                    <h2>
                        Roles registrados
                    </h2>

                    <p>
                        {filteredItems.length ===
                        1
                            ? "1 rol encontrado"
                            : `${filteredItems.length} roles encontrados`}
                    </p>
                </div>
            </div>

            {/* ======================================================
                TABLA
                ====================================================== */}

            <div className="roles-table-card">
                <div className="roles-table-scroll">
                    <table className="roles-table">
                        <thead>
                            <tr>
                                <th>
                                    Nombre del rol
                                </th>

                                <th>
                                    Aplicación
                                    asociada
                                </th>

                                <th>
                                    Descripción
                                </th>

                                <th>
                                    Estado
                                </th>

                                <th className="roles-actions-header">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading &&
                                Array.from(
                                    {
                                        length: 4,
                                    }
                                ).map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                index
                                            }
                                        >
                                            <td
                                                colSpan={
                                                    5
                                                }
                                            >
                                                <div className="roles-skeleton" />
                                            </td>
                                        </tr>
                                    )
                                )}

                            {!loading &&
                                filteredItems.length ===
                                    0 && (
                                    <tr>
                                        <td
                                            colSpan={
                                                5
                                            }
                                            className="roles-empty"
                                        >
                                            <ShieldCheck
                                                size={
                                                    28
                                                }
                                            />

                                            <strong>
                                                No se
                                                encontraron
                                                roles
                                            </strong>

                                            <span>
                                                Cambia
                                                o limpia
                                                los
                                                filtros
                                                de
                                                búsqueda.
                                            </span>
                                        </td>
                                    </tr>
                                )}

                            {!loading &&
                                filteredItems.map(
                                    (
                                        role
                                    ) => (
                                        <tr
                                            key={
                                                role.id_rol
                                            }
                                        >
                                            <td>
                                                <div className="roles-entity-cell">
                                                    <div className="roles-entity-icon">
                                                        <ShieldCheck
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </div>

                                                    <div className="roles-entity-info">
                                                        <strong>
                                                            {
                                                                role.nombre
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                role.codigo
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="roles-app-info">
                                                    <strong>
                                                        {
                                                            role
                                                                .aplicacion
                                                                .nombre
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            role
                                                                .aplicacion
                                                                .codigo
                                                        }
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="roles-description">
                                                {
                                                    role.descripcion
                                                }
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        role.activo
                                                            ? "roles-status active"
                                                            : "roles-status inactive"
                                                    }
                                                >
                                                    <span className="roles-status-dot" />

                                                    {role.activo
                                                        ? "Activo"
                                                        : "Inactivo"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="roles-row-actions">
                                                    <button
                                                        type="button"
                                                        className="roles-action edit"
                                                        onClick={() =>
                                                            openEdit(
                                                                role
                                                            )
                                                        }
                                                    >
                                                        <Pencil
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={
                                                            role.activo
                                                                ? "roles-action disable"
                                                                : "roles-action enable"
                                                        }
                                                        onClick={() =>
                                                            void handleToggleActivo(
                                                                role
                                                            )
                                                        }
                                                    >
                                                        {role.activo ? (
                                                            <UserX
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        ) : (
                                                            <UserCheck
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        )}

                                                        {role.activo
                                                            ? "Deshabilitar"
                                                            : "Habilitar"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ======================================================
                FORMULARIO
                ====================================================== */}

            {showForm && (
                <RoleForm
                    initial={
                        editingRole ||
                        undefined
                    }
                    onCancel={
                        closeForm
                    }
                    onSave={async (
                        data,
                        id
                    ) => {
                        if (id) {
                            await update(
                                id,
                                data
                            );
                        } else {
                            await create(
                                data
                            );
                        }

                        closeForm();
                    }}
                />
            )}
        </section>
    );
}