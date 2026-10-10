export interface FiltroRol {
    id_rol: number;
    nombre: string;
    codigo: string;

    id_aplicacion?: number;
    aplicacion_codigo?: string;
}


export interface RolConfigUsuario {
    id_rol: number;
    nombre: string;
    codigo: string;
    default: boolean;

    id_aplicacion?: number;
    aplicacion_codigo?: string;
}