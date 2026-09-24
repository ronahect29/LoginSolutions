import {
    AppWindow,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";

import {
    useApps,
} from "../../hooks/useApps";
import type {
    AppEntity,
} from "../../services/apps.service";
import "../../styles/AppsPage.css";
import {
    AppsForm,
} from "./AppsForm";

export function AppsPage() {
    const {
        items,
        loading,
        error,
        create,
        update,
        changeActivo,
    } =
        useApps();

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

    const editingApp =
        items.find(
            (app) =>
                app.id_aplicacion ===
                editingId
        ) || null;

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
                (app) => {
                    const matchesText =
                        !text ||
                        app.nombre
                            .toLowerCase()
                            .includes(
                                text
                            ) ||
                        app.codigo
                            .toLowerCase()
                            .includes(
                                text
                            ) ||
                        (
                            app.descripcion ??
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                text
                            );

                    const matchesStatus =
                        !statusFilter ||
                        (
                            statusFilter ===
                            "activo"
                                ? app.activo
                                : !app.activo
                        );

                    return (
                        matchesText &&
                        matchesStatus
                    );
                }
            );
        }, [
            items,
            search,
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
        app: AppEntity
    ) {
        setEditingId(
            app.id_aplicacion
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
        app: AppEntity
    ) {
        const nuevoEstado =
            !app.activo;

        const accion =
            nuevoEstado
                ? "habilitar"
                : "deshabilitar";

        const ok =
            window.confirm(
                `¿Confirmas que deseas ${accion} la aplicación "${app.nombre}"?`
            );

        if (!ok) {
            return;
        }

        setActionError(
            null
        );

        try {
            await changeActivo(
                app.id_aplicacion,
                nuevoEstado
            );
        } catch (err) {
            console.error(
                "Error cambiando estado de aplicación",
                err
            );

            setActionError(
                "No se pudo cambiar el estado de la aplicación."
            );
        }
    }

    // ======================================================
    // LIMPIAR
    // ======================================================

    function clearFilters() {
        setSearch("");
        setStatusFilter("");
    }

    return (
        <section className="apps-page">
            {/* ======================================================
                ENCABEZADO
                ====================================================== */}

            <div className="apps-page-heading">
                <span className="apps-page-kicker">
                    Gestión de aplicaciones
                </span>

                <div className="apps-page-heading-row">
                    <div className="apps-page-heading-text">
                        <h1>
                            Aplicaciones
                        </h1>

                        <p>
                            Administra las
                            aplicaciones que
                            forman parte de la
                            plataforma y sobre
                            las cuales se
                            definen los roles
                            de acceso.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="apps-create-button"
                        onClick={
                            openCreate
                        }
                    >
                        <Plus
                            size={
                                18
                            }
                        />

                        Nueva aplicación
                    </button>
                </div>
            </div>

            {/* ======================================================
                FILTROS
                ====================================================== */}

            <section className="apps-filter-card">
                <div className="apps-filter-header">
                    <h2>
                        Buscar aplicaciones
                    </h2>

                    <p>
                        Busca por nombre,
                        código técnico,
                        descripción o estado.
                    </p>
                </div>

                <div className="apps-filter-grid">
                    <div className="apps-field">
                        <label htmlFor="apps-search">
                            Nombre o código
                        </label>

                        <div className="apps-search-field">
                            <Search
                                size={
                                    15
                                }
                            />

                            <input
                                id="apps-search"
                                type="text"
                                value={
                                    search
                                }
                                placeholder="Ej. Marcajes o PMW"
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

                    <div className="apps-field">
                        <label htmlFor="apps-status">
                            Estado
                        </label>

                        <select
                            id="apps-status"
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
                                Todas
                            </option>

                            <option value="activo">
                                Activas
                            </option>

                            <option value="inactivo">
                                Inactivas
                            </option>
                        </select>
                    </div>
                </div>

                <div className="apps-filter-actions">
                    <button
                        type="button"
                        className="apps-clear-button"
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
                <div className="apps-page-error">
                    {error ||
                        actionError}
                </div>
            )}

            {/* ======================================================
                LISTADO
                ====================================================== */}

            <div className="apps-list-heading">
                <div>
                    <h2>
                        Aplicaciones registradas
                    </h2>

                    <p>
                        {filteredItems.length ===
                        1
                            ? "1 aplicación encontrada"
                            : `${filteredItems.length} aplicaciones encontradas`}
                    </p>
                </div>
            </div>

            <div className="apps-table-card">
                <div className="apps-table-scroll">
                    <table className="apps-table">
                        <thead>
                            <tr>
                                <th>
                                    Aplicación
                                </th>

                                <th>
                                    Descripción
                                </th>

                                <th>
                                    Estado
                                </th>

                                <th className="apps-actions-header">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading &&
                                Array.from(
                                    {
                                        length: 3,
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
                                                    4
                                                }
                                            >
                                                <div className="apps-skeleton" />
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
                                                4
                                            }
                                            className="apps-empty"
                                        >
                                            <AppWindow
                                                size={
                                                    28
                                                }
                                            />

                                            <strong>
                                                No se
                                                encontraron
                                                aplicaciones
                                            </strong>

                                            <span>
                                                Cambia los
                                                filtros o
                                                registra una
                                                nueva
                                                aplicación.
                                            </span>
                                        </td>
                                    </tr>
                                )}

                            {!loading &&
                                filteredItems.map(
                                    (
                                        app
                                    ) => (
                                        <tr
                                            key={
                                                app.id_aplicacion
                                            }
                                        >
                                            <td>
                                                <div className="apps-entity-cell">
                                                    <div className="apps-entity-icon">
                                                        <AppWindow
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </div>

                                                    <div className="apps-entity-info">
                                                        <strong>
                                                            {
                                                                app.nombre
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                app.codigo
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="apps-description">
                                                {app.descripcion ||
                                                    "Sin descripción"}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        app.activo
                                                            ? "apps-status active"
                                                            : "apps-status inactive"
                                                    }
                                                >
                                                    <span className="apps-status-dot" />

                                                    {app.activo
                                                        ? "Activa"
                                                        : "Inactiva"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="apps-row-actions">
                                                    <button
                                                        type="button"
                                                        className="apps-action edit"
                                                        onClick={() =>
                                                            openEdit(
                                                                app
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
                                                            app.activo
                                                                ? "apps-action disable"
                                                                : "apps-action enable"
                                                        }
                                                        onClick={() =>
                                                            void handleToggleActivo(
                                                                app
                                                            )
                                                        }
                                                    >
                                                        {app.activo ? (
                                                            <ToggleLeft
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        ) : (
                                                            <ToggleRight
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        )}

                                                        {app.activo
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
                MODAL
                ====================================================== */}

            {showForm && (
                <AppsForm
                    initial={
                        editingApp ||
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