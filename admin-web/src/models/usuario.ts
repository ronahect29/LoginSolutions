import type { Rol } from "./rol";

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
    activo: boolean | null;
    roles?: string[];
    apps?: string[];
    page?: number;
    pageSize?: number;
    orderBy?: {
        field: UsuarioSorteableField;
        direction: "asc" | "desc";
    }
}