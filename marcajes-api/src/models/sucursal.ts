export interface Sucursal {
    id_sucursal: number;
    nombre: string;
    telefono: string | null;
    direccion: string;
    latitud: number | null;
    longitud: number | null;
    radio_marcaje_metros: number;
    activo: boolean | null;
    fecha_creacion: Date;
    creador: string;
    fecha_modificacion: Date | null;
    modificador: string | null;
}

export interface CrearSucursalDto {
    nombre: string;
    telefono?: string | null;
    direccion: string;
    latitud?: number | null;
    longitud?: number | null;
    radio_marcaje_metros?: number;
    activo?: boolean;
    creador: string;
}

export interface ActualizarSucursalDto {
    nombre?: string;
    telefono?: string | null;
    direccion?: string;
    latitud?: number | null;
    longitud?: number | null;
    radio_marcaje_metros?: number;
    activo?: boolean;
    modificador: string;
}