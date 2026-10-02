export interface UsuarioSesionDto {
    id_usuario: number;
    nombre: string;
    username: string;
    correo: string;
    activo: boolean;
    roles?: Object[];
}

export interface UsuarioAdminTable {
    id_usuario: number;
    nombre: string;
    correo: string;
    usuario: string;

    fechaCreacion: string;
    fechaModificacion: string;

    fechaBaja: string;
    motivoBaja: string | null;
    bajaUsuario: number | null;

    activo: boolean | null;

    roles?: string[];
    apps?: string[];
}

export type UsuarioSortField =
    | "nombre"
    | "correo"
    | "username"
    | "activo"
    | "fecha_creacion"
    | "fecha_modificacion";

export interface BuscarUsuariosDto {
    nombre?: string | null;
    usuario?: string | null;
    activo?: boolean | null;

    creadoDesde?: string | null;
    creadoHasta?: string | null;

    modDesde?: string | null;
    modHasta?: string | null;

    appsCodes?: string[];
    rolesCodes?: string[];

    page?: number;
    pageSize?: number;

    orderBy?: {
        field:
            UsuarioSortField;

        direction:
            "asc" |
            "desc";
    };
}

export type CreateUserDto = {
    nombre: string;
    correo: string;
    username: string;
    password: string;
    direccion: string;
    telefono: string;
};

export type UpdateUserDto = {
    nombre: string;
    correo: string;
    username: string;
    direccion?: string | null;
    telefono?: string | null;
};