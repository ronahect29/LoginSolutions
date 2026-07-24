export interface AplicacionDto {
    id_aplicacion: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    activo: boolean;
}

export interface AplicacionFiltroDto {
    id_aplicacion: number;
    nombre: string;
    codigo: string;
}