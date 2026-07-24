export interface Sucursal {
    id_sucursal: number;
    nombre: string;
    telefono?: string;
    direccion?: string;
    latitud?: number;
    longitud?: number;
    activo?: boolean;
    fecha_creacion: Date;
    creador: string;
    fecha_modificacion: Date;
    modificador: string;
}