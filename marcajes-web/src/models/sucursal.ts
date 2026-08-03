export interface FiltroSucursal {
    id_sucursal: number;
    nombre: string;
}

export interface SucursalCatalogo {
    id_sucursal: number;
    nombre: string;
    telefono: string | null;
    direccion: string;
    latitud: string | number | null;
    longitud: string | number | null;
    radio_marcaje_metros: number;
    activo: boolean | null;
    fecha_creacion: string;
    creador: string;
    fecha_modificacion: string | null;
    modificador: string | null;
}

export interface CrearSucursalDto {
    nombre: string;
    telefono: string | null;
    direccion: string;
    latitud: number | null;
    longitud: number | null;
    radio_marcaje_metros: number;
    activo: boolean;
    creador: string;
}

export interface ActualizarSucursalDto {
    nombre: string;
    telefono: string | null;
    direccion: string;
    latitud: number | null;
    longitud: number | null;
    radio_marcaje_metros: number;
    activo: boolean;
    modificador: string;
}

export interface RespuestaSucursal {
    message: string;
    sucursal: SucursalCatalogo;
}

export interface FormularioSucursal {
    nombre: string;
    telefono: string;
    direccion: string;
    latitud: string;
    longitud: string;
    radio_marcaje_metros: string;
    activo: boolean;
}