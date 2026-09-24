import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Pencil,
    UserCheck,
    UserX,
} from "lucide-react";

import type { UsuarioSorteableField } from "../../models/usuario";
import "../../styles/UserTable.css";
import type { UserTableProps } from "./types";

function getInitials(
    nombre: string
): string {
    const parts =
        nombre
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (parts.length === 0) {
        return "US";
    }

    if (parts.length === 1) {
        return parts[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatDate(
    value?: string | null
): string {
    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return new Intl.DateTimeFormat(
        "es-GT",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }
    ).format(date);
}

export function UserTable({
    users,
    loading = false,
    sort,
    onSortChange,
    page,
    pageSize,
    total,
    onPageChange,
    onEdit,
    onToggleActivo,
}: UserTableProps) {
    const totalPages =
        Math.max(
            1,
            Math.ceil(
                total /
                    pageSize
            )
        );

    const registroDesde =
        total === 0
            ? 0
            : (page - 1) *
                  pageSize +
              1;

    const registroHasta =
        Math.min(
            page * pageSize,
            total
        );

    function handleSort(
        field:
            UsuarioSorteableField
    ) {
        if (!onSortChange) {
            return;
        }

        const direction =
            sort?.field ===
                field &&
            sort.direction ===
                "asc"
                ? "desc"
                : "asc";

        onSortChange({
            field,
            direction,
        });
    }

    function renderSortIcon(
        field:
            UsuarioSorteableField
    ) {
        if (
            !sort ||
            sort.field !==
                field
        ) {
            return (
                <ArrowUpDown
                    size={13}
                />
            );
        }

        if (
            sort.direction ===
            "asc"
        ) {
            return (
                <ArrowUp
                    size={13}
                />
            );
        }

        return (
            <ArrowDown
                size={13}
            />
        );
    }

    return (
        <div className="users-table-card">
            <div className="users-table-scroll">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>
                                <button
                                    type="button"
                                    className="users-sort-button"
                                    onClick={() =>
                                        handleSort(
                                            "nombre"
                                        )
                                    }
                                >
                                    <span>
                                        Usuario
                                    </span>

                                    {renderSortIcon(
                                        "nombre"
                                    )}
                                </button>
                            </th>

                            <th>
                                Roles
                            </th>

                            <th>
                                <button
                                    type="button"
                                    className="users-sort-button"
                                    onClick={() =>
                                        handleSort(
                                            "activo"
                                        )
                                    }
                                >
                                    <span>
                                        Estado
                                    </span>

                                    {renderSortIcon(
                                        "activo"
                                    )}
                                </button>
                            </th>

                            <th>
                                <button
                                    type="button"
                                    className="users-sort-button"
                                    onClick={() =>
                                        handleSort(
                                            "fecha_creacion"
                                        )
                                    }
                                >
                                    <span>
                                        Creación
                                    </span>

                                    {renderSortIcon(
                                        "fecha_creacion"
                                    )}
                                </button>
                            </th>

                            <th>
                                <button
                                    type="button"
                                    className="users-sort-button"
                                    onClick={() =>
                                        handleSort(
                                            "fecha_modificacion"
                                        )
                                    }
                                >
                                    <span>
                                        Modificación
                                    </span>

                                    {renderSortIcon(
                                        "fecha_modificacion"
                                    )}
                                </button>
                            </th>

                            <th className="users-actions-header">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading &&
                            Array.from({
                                length:
                                    Math.min(
                                        pageSize,
                                        5
                                    ),
                            }).map(
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
                                                6
                                            }
                                        >
                                            <div className="users-skeleton-line" />
                                        </td>
                                    </tr>
                                )
                            )}

                        {!loading &&
                            users.length ===
                                0 && (
                                <tr>
                                    <td
                                        colSpan={
                                            6
                                        }
                                        className="users-table-empty"
                                    >
                                        <strong>
                                            No se encontraron
                                            usuarios
                                        </strong>

                                        <span>
                                            Prueba cambiando
                                            o limpiando los
                                            filtros de
                                            búsqueda.
                                        </span>
                                    </td>
                                </tr>
                            )}

                        {!loading &&
                            users.map(
                                (
                                    user
                                ) => (
                                    <tr
                                        key={
                                            user.id_usuario
                                        }
                                    >
                                        <td>
                                            <div className="users-user-cell">
                                                <div className="users-user-avatar">
                                                    {getInitials(
                                                        user.nombre
                                                    )}
                                                </div>

                                                <div className="users-user-info">
                                                    <strong>
                                                        {
                                                            user.nombre
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            user.correo
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="users-role-list">
                                                {user.roles &&
                                                user
                                                    .roles
                                                    .length >
                                                    0 ? (
                                                    user.roles.map(
                                                        (
                                                            role
                                                        ) => (
                                                            <span
                                                                key={
                                                                    role
                                                                }
                                                                className="users-role-badge"
                                                            >
                                                                {
                                                                    role
                                                                }
                                                            </span>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="users-no-role">
                                                        Sin
                                                        rol
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    user.activo
                                                        ? "users-status active"
                                                        : "users-status inactive"
                                                }
                                            >
                                                <span className="users-status-dot" />

                                                {user.activo
                                                    ? "Activo"
                                                    : "Inactivo"}
                                            </span>
                                        </td>

                                        <td className="users-date-cell">
                                            {formatDate(
                                                user.fechaCreacion
                                            )}
                                        </td>

                                        <td className="users-date-cell">
                                            {formatDate(
                                                user.fechaModificacion
                                            )}
                                        </td>

                                        <td>
                                            <div className="users-row-actions">
                                                {onEdit && (
                                                    <button
                                                        type="button"
                                                        className="users-action-button edit"
                                                        onClick={() =>
                                                            onEdit(
                                                                user
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        title="Editar usuario"
                                                    >
                                                        <Pencil
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        <span>
                                                            Editar
                                                        </span>
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    className={
                                                        user.activo
                                                            ? "users-action-button disable"
                                                            : "users-action-button enable"
                                                    }
                                                    onClick={() =>
                                                        onToggleActivo?.(
                                                            user
                                                        )
                                                    }
                                                    disabled={
                                                        loading
                                                    }
                                                >
                                                    {user.activo ? (
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

                                                    <span>
                                                        {user.activo
                                                            ? "Deshabilitar"
                                                            : "Habilitar"}
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                    </tbody>
                </table>
            </div>

            {/* ======================================================
                PAGINACIÓN
                ====================================================== */}

            <div className="users-pagination">
                <div className="users-pagination-summary">
                    {total === 0
                        ? "Sin registros"
                        : `Mostrando ${registroDesde}-${registroHasta} de ${total}`}
                </div>

                <div className="users-pagination-controls">
                    <button
                        type="button"
                        disabled={
                            page ===
                                1 ||
                            loading
                        }
                        onClick={() =>
                            onPageChange?.(
                                page -
                                    1
                            )
                        }
                    >
                        Anterior
                    </button>

                    <span>
                        Página {page} de{" "}
                        {totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={
                            page >=
                                totalPages ||
                            loading ||
                            total ===
                                0
                        }
                        onClick={() =>
                            onPageChange?.(
                                page +
                                    1
                            )
                        }
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}