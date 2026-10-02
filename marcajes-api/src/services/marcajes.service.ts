import type {
    Marcaje,
    ResultadoRegistroMarcaje,
    ValidacionUbicacionMarcaje
} from "../models/marcaje";

import { prisma } from "../prisma";
import { calcularDistancia } from "../utils/gpsUtils";
import { cleanDate } from "../utils/utilidades";


// ======================================================
// SERVICIO DE MARCAJES
// ======================================================

export const MarcajeService = {
    findAll() {
        return prisma.marcaje.findMany();
    },


    findMarcajeByEmpleadoAndFecha(
        id_empleado: number,
        fecha: string
    ) {
        const date =
            cleanDate(fecha);

        return prisma.marcaje.findMany({
            where: {
                empleado_marcaje_empleadoToempleado: {
                    id_empleado
                },

                fecha: {
                    gte: date.start,
                    lte: date.end
                }
            }
        });
    },


    // ======================================================
    // REGISTRAR MARCAJE
    // ======================================================

    async registrarMarcajeByEmpleadoData(
        marcaje: Marcaje
    ): Promise<ResultadoRegistroMarcaje> {
        const hoy =
            new Date();

        hoy.setHours(
            0,
            0,
            0,
            0
        );


        // ======================================================
        // VALIDAR MARCAJE DUPLICADO
        // ======================================================

        const existe =
            await prisma.marcaje.findFirst({
                where: {
                    fecha: hoy,
                    empleado:
                        marcaje.empleado,
                    es_entrada:
                        marcaje.es_entrada
                }
            });


        if (existe) {
            throw new Error(
                marcaje.es_entrada
                    ? "Ya existe una entrada registrada hoy"
                    : "Ya existe una salida registrada hoy"
            );
        }


        // ======================================================
        // OBTENER EMPLEADO Y SUCURSAL
        // ======================================================

        const empleado =
            await prisma.empleado.findUnique({
                where: {
                    id_empleado:
                        marcaje.empleado
                },

                select: {
                    id_empleado: true,
                    sucursal: true,

                    sucursal_empleado_sucursalTosucursal: {
                        select: {
                            id_sucursal: true,
                            nombre: true,
                            latitud: true,
                            longitud: true,
                            radio_marcaje_metros: true,
                            activo: true
                        }
                    }
                }
            });


        if (!empleado) {
            throw new Error(
                "El empleado no existe."
            );
        }


        const sucursal =
            empleado
                .sucursal_empleado_sucursalTosucursal;


        // ======================================================
        // VALORES DE REFERENCIA
        // ======================================================

        let sucursalReferencia:
            number | null =
            null;

        let sucursalLatitud:
            number | null =
            null;

        let sucursalLongitud:
            number | null =
            null;

        let radioPermitido:
            number | null =
            null;

        let distanciaMetros:
            number | null =
            null;

        let fueraRango:
            boolean | null =
            null;


        let validacion:
            ValidacionUbicacionMarcaje;


        // ======================================================
        // EMPLEADO SIN SUCURSAL
        // ======================================================

        if (!sucursal) {
            validacion = {
                estado:
                    "SIN_SUCURSAL",

                sucursalId:
                    null,

                sucursalNombre:
                    null,

                distanciaMetros:
                    null,

                radioPermitidoMetros:
                    null,

                fueraRango:
                    null
            };
        } else {
            sucursalReferencia =
                sucursal.id_sucursal;

            radioPermitido =
                sucursal
                    .radio_marcaje_metros;


            // ======================================================
            // SUCURSAL SIN COORDENADAS
            // ======================================================

            if (
                sucursal.latitud === null ||
                sucursal.longitud === null
            ) {
                validacion = {
                    estado:
                        "SUCURSAL_SIN_UBICACION",

                    sucursalId:
                        sucursal.id_sucursal,

                    sucursalNombre:
                        sucursal.nombre,

                    distanciaMetros:
                        null,

                    radioPermitidoMetros:
                        radioPermitido,

                    fueraRango:
                        null
                };
            } else {
                sucursalLatitud =
                    Number(
                        sucursal.latitud
                    );

                sucursalLongitud =
                    Number(
                        sucursal.longitud
                    );


                // ======================================================
                // CALCULAR DISTANCIA
                // ======================================================

                distanciaMetros =
                    calcularDistancia(
                        marcaje.latitud,
                        marcaje.longitud,
                        sucursalLatitud,
                        sucursalLongitud
                    );


                fueraRango =
                    distanciaMetros >
                    radioPermitido;


                validacion = {
                    estado:
                        fueraRango
                            ? "FUERA_RANGO"
                            : "DENTRO_RANGO",

                    sucursalId:
                        sucursal.id_sucursal,

                    sucursalNombre:
                        sucursal.nombre,

                    distanciaMetros,

                    radioPermitidoMetros:
                        radioPermitido,

                    fueraRango
                };
            }
        }


        // ======================================================
        // GUARDAR MARCAJE Y SNAPSHOT DE UBICACIÓN
        // ======================================================

        const marcajeCreado =
            await prisma.marcaje.create({
                data: {
                    empleado:
                        marcaje.empleado,

                    fecha:
                        hoy,

                    hora:
                        marcaje.hora,

                    es_entrada:
                        marcaje.es_entrada,

                    latitud:
                        marcaje.latitud,

                    longitud:
                        marcaje.longitud,

                    sucursal_referencia:
                        sucursalReferencia,

                    sucursal_latitud_referencia:
                        sucursalLatitud,

                    sucursal_longitud_referencia:
                        sucursalLongitud,

                    radio_permitido_metros:
                        radioPermitido,

                    distancia_sucursal_metros:
                        distanciaMetros,

                    fuera_rango:
                        fueraRango
                }
            });


        return {
            marcaje:
                marcajeCreado,

            validacionUbicacion:
                validacion
        };
    },


    findOne(
        id: number
    ) {
        return prisma.marcaje.findUnique({
            where: {
                id_marcaje: id
            }
        });
    },


    create(
        data: unknown
    ) {
        return prisma.marcaje.create({
            data: data as never
        });
    }
};