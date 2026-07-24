import { calcularHorasLaboradas } from "../utils/utilidades";
import { calcularDistancia } from "../utils/gpsUtils";
import { MarcajeReporteDto } from "../models/marcaje";
import { MarcajeReporteRespuestaDto } from "../models/marcaje";

export function mapMarcajeToRespuesta(
    m: MarcajeReporteDto
): MarcajeReporteRespuestaDto {
    return {
        id_marcaje: m.id_marcaje,
        fecha: m.fecha,
        hora_entrada: m.hora_entrada,
        hora_salida: m.hora_salida,

        horas_trabajadas:
            m.hora_entrada && m.hora_salida
                ? calcularHorasLaboradas(m.hora_entrada, m.hora_salida)
                : "-",

        ubicacion_entrada: m.ubicacion_entrada,
        ubicacion_salida: m.ubicacion_salida,

        empleado_id: m.empleado_id,
        empleado_jefe: m.empleado_jefe,
        empleado_nombre: m.empleado_nombre,
        empleado_correo: m.empleado_correo,

        sucursal_id: m.sucursal_id,
        sucursal_nombre: m.sucursal_nombre,
        sucursal_ubicacion: m.sucursal_ubicacion,

        distancia_entrada: calcularDistancia(
            m.lat_entrada,
            m.lng_entrada,
            m.sucursal_latitud,
            m.sucursal_longitud
        ),

        distancia_salida: calcularDistancia(
            m.lat_salida,
            m.lng_salida,
            m.sucursal_latitud,
            m.sucursal_longitud
        ),
    };
}
