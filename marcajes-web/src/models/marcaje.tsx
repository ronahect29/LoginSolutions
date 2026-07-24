export interface Marcaje {
    id_marcaje: number;
    fecha: string;
    hora: string;
    es_entrada: boolean;
    latitud: string;
    longitud: string;
    empleado: {
        correo: string;
        nombre: string;
    };
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

    distancia_entrada: number;
    distancia_salida: number;
}
export interface FiltrosMarcajes {
    fechaDesde: string | null;
    fechaHasta: string | null;
    jefeId: number | null;
    empleadoId: number | null;
    sucursales: number[] | null;
    fueraDeRango: boolean | null;
}