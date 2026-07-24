export interface Marcaje {
    id_marcaje?: number;
    fecha: Date;
    hora: string;
    es_entrada: boolean;
    latitud?: number;
    longitud?: number;
    empleado: number;
}

export interface MarcajeReporteDto {
    id_marcaje: number;
    fecha: Date;
    hora_entrada: string;
    hora_salida: string;
    horas_trabajadas?: string;
    ubicacion_entrada?: string;
    ubicacion_salida?: string;
    empleado_id: number;
    empleado_jefe?: number;
    empleado_nombre: string;
    empleado_correo: string;
    sucursal_id?: string;
    sucursal_nombre?: string;
    sucursal_ubicacion?: string;

    lat_entrada?: number;
    lng_entrada?: number;
    lat_salida?: number;
    lng_salida?: number;

    sucursal_latitud?: number;
    sucursal_longitud?: number;

    distancia_entrada: number;
    distancia_salida: number;
}

export interface MarcajeReporteRespuestaDto {
    id_marcaje: number;
    fecha: Date;
    hora_entrada: string;
    hora_salida: string;
    horas_trabajadas?: string;
    ubicacion_entrada?: string;
    ubicacion_salida?: string;
    empleado_id: number;
    empleado_jefe?: number;
    empleado_nombre: string;
    empleado_correo: string;
    sucursal_id?: string;
    sucursal_nombre?: string;
    sucursal_ubicacion?: string;

    distancia_entrada: number;
    distancia_salida: number;
}

export interface BuscarMarcajesDto {
    fechaDesde?: string | null;
    fechaHasta?: string | null;
    sucursales?: number[] | null;
    fueraDeRango?: boolean | null;
}