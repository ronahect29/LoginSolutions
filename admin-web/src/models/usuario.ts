import type {
    Rol
} from "./rol";

export interface AuthUsuario {
    id_usuario: number;
    correo: string;
    nombre: string;
    username: string;
    roles: Rol[];
}

export type UsuarioSorteableField =
    | "nombre"
    | "correo"
    | "username"
    | "activo"
    | "fecha_creacion"
    | "fecha_modificacion";

export interface Usuario {
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

    page?: number;
    pageSize?: number;

    orderBy?: {
        field:
            UsuarioSorteableField;

        direction:
            "asc" |
            "desc";
    };
}

export interface UsuarioDetalle {
    id_usuario: number;
    correo: string;
    nombre: string;
    username: string;
    direccion: string | null;
    telefono: string;
    activo: boolean;

    fecha_creacion: string | null;
    fecha_modificacion: string | null;

    fecha_baja: string | null;
    motivo_baja: string | null;
    baja_usuario: number | null;
}