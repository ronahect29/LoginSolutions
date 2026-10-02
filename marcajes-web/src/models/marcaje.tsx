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


// ======================================================
// VALIDACIÓN DE UBICACIÓN
// ======================================================

export type EstadoValidacionUbicacion =
    | "DENTRO_RANGO"
    | "FUERA_RANGO"
    | "SIN_SUCURSAL"
    | "SUCURSAL_SIN_UBICACION";


export interface ValidacionUbicacionMarcaje {
    estado: EstadoValidacionUbicacion;

    sucursalId: number | null;
    sucursalNombre: string | null;

    distanciaMetros: number | null;
    radioPermitidoMetros: number | null;

    fueraRango: boolean | null;
}


export interface MarcajeRegistrado {
    id_marcaje: number;
    fecha: string;
    hora: string;
    es_entrada: boolean;

    latitud: string | number | null;
    longitud: string | number | null;

    empleado: number;

    sucursal_referencia: number | null;

    sucursal_latitud_referencia:
        string | number | null;

    sucursal_longitud_referencia:
        string | number | null;

    radio_permitido_metros:
        number | null;

    distancia_sucursal_metros:
        number | null;

    fuera_rango:
        boolean | null;
}


export interface ResultadoRegistroMarcaje {
    marcaje: MarcajeRegistrado;

    validacionUbicacion:
        ValidacionUbicacionMarcaje;
}


// ======================================================
// REPORTE
// ======================================================

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