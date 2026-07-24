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

    appsCodes?: string[];   // códigos de aplicación
    rolesCodes?: string[];  // códigos de rol
    page?: number;
    pageSize?: number;
    orderBy?: {
        field: UsuarioSortField;
        direction: "asc" | "desc";
    }
}

export type CreateUserDto ={
    nombre: string;
    correo: string;
    username: string;
    password: string;
    direccion: string;
    telefono: string;
}