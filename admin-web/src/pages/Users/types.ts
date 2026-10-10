import type {
    SortState
} from "../../models/Sort";

import type {
    Usuario,
    UsuarioSorteableField
} from "../../models/usuario";


export interface UserTableProps {
    users:
        Usuario[];

    loading?:
        boolean;

    sort?:
        SortState<
            UsuarioSorteableField
        >;

    onSortChange?:
        (
            sort:
                SortState<
                    UsuarioSorteableField
                >
        ) => void;

    page:
        number;

    pageSize:
        number;

    total:
        number;

    onPageChange?:
        (
            page:
                number
        ) => void;

    onEdit?:
        (
            user:
                Usuario
        ) => void;

    onManageAccess?:
        (
            user:
                Usuario
        ) => void;

    onResetPassword?:
        (
            user:
                Usuario
        ) => void;

    onToggleActivo?:
        (
            user:
                Usuario
        ) => void;
}