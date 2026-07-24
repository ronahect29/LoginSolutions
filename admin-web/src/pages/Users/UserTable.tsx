import type { UsuarioSorteableField } from "../../models/usuario";
// import type { SortState } from "./types";
import "../../styles/UserTable.css";
import { getSortIcon, handleSortChage } from "../../utils/sort";
import type { UserTableProps } from "./types";

// type SorteableFiled = "nombre" | "correo" | "activo"
// interface UserTableProps {
//     users: Usuario[];
//     loading?: boolean;

//     sort?: SortState<UsuarioSorteableField>;
//     onSortChange?: (field: keyof Usuario) => void;

//     page: number;
//     pageSize: number;
//     total: number;
//     onPageChange?: (page: number) => void;

//     onEdit?: (user: Usuario) => void;
//     onToggleActivo?: (user: Usuario) => void;
// }

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
    const totalPages = Math.ceil(total / pageSize);

    // function renderSort(field: keyof Usuario) {
    //     if (!sort || sort.field !== field) return "⇅";
    //     return sort.direction === "asc" ? "↑" : "↓";
    // }
    function onHeaderClick(field: UsuarioSorteableField) {
        if (!onSortChange) return;
        onSortChange(handleSortChage(sort, field));
    }

    return (
        <div className="user-table-container">
            <table className="user-table">
                <thead>
                    <tr>
                        <th onClick={() => onHeaderClick("nombre")}>
                            Nombre {getSortIcon(sort, "nombre")}
                        </th>

                        <th onClick={() => onHeaderClick("correo")}>
                            Correo {getSortIcon(sort, "correo")}
                        </th>

                        <th>
                            Roles
                        </th>

                        <th onClick={() => onHeaderClick("activo")}>
                            Estado {getSortIcon(sort, "activo")}
                        </th>

                        <th onClick={() => onHeaderClick("fecha_creacion")}>
                            Creación {getSortIcon(sort, "fecha_creacion")}
                        </th>

                        <th onClick={() => onHeaderClick("fecha_modificacion")}>
                            Modificación {getSortIcon(sort, "fecha_modificacion")}
                        </th>

                        <th className="actions-col">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Loading skeleton */}
                    {loading &&
                        Array.from({ length: pageSize }).map((_, i) => (
                            <tr key={i} className="skeleton-row">
                                <td colSpan={7}>
                                    <div className="skeleton-line" />
                                </td>
                            </tr>
                        ))}

                    {/* Empty state */}
                    {!loading && users.length === 0 && (
                        <tr>
                            <td colSpan={7} className="user-table-empty">
                                No se encontraron usuarios
                            </td>
                        </tr>
                    )}

                    {/* Rows */}
                    {!loading &&
                        users.map((user) => (
                            <tr key={user.id_usuario}>
                                <td>{user.nombre}</td>
                                <td>{user.correo}</td>
                                <td>{user.roles?.join(", ")}</td>
                                <td>
                                    <span
                                        className={
                                            user.activo
                                                ? "status active"
                                                : "status inactive"
                                        }
                                    >
                                        {user.activo ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
                                <td>{user.fechaCreacion}</td>
                                <td>{user.fechaModificacion}</td>
                                <td className="actions">
                                    <button
                                        className="btn edit"
                                        onClick={() => onEdit?.(user)}
                                        disabled={loading}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className={
                                            user.activo
                                                ? "btn disable"
                                                : "btn enable"
                                        }
                                        onClick={() => onToggleActivo?.(user)}
                                        disabled={loading}
                                    >
                                        {user.activo ? "Deshabilitar" : "Habilitar"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="user-table-pagination">
                <button
                    disabled={page === 1 || loading}
                    onClick={() => onPageChange?.(page - 1)}
                >
                    Anterior
                </button>

                <span>
                    Página {page} de {totalPages}
                </span>

                <button
                    disabled={page === totalPages || loading}
                    onClick={() => onPageChange?.(page + 1)}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
