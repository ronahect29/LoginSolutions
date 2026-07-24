import { AplicacionDto } from "./Aplicacion";

export interface RolDto {
    id_rol: number;
    nombre: string;
    descripcion: string;
    codigo: string;
    activo: boolean;
    aplicacion?: AplicacionDto
    por_defecto?: boolean;
}
export interface RolFiltroDto {
    id_rol: number;
    nombre: string,
    codigo: string
}
export interface RolConfigUsuario {
    id_rol: number;
    nombre: string;
    codigo: string;
    default: boolean;
}