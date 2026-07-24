import type { SortState } from "../../models/Sort";
import type { Usuario, UsuarioSorteableField } from "../../models/usuario";


export interface UserTableProps {
    users: Usuario[];

    // loading
    loading?: boolean;

    // ordenamiento
    sort?: SortState<UsuarioSorteableField>;
    onSortChange?: (sort: SortState<UsuarioSorteableField>) => void;

    // paginacion - para permitir un lazy loading
    page: number;
    pageSize: number;
    total: number;
    onPageChange?: (page: number) => void;

    // acciones o eventos
    onEdit?: (user: Usuario) => void;
    onToggleActivo?: (user: Usuario) => void;
}
