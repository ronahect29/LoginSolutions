import type {
    Request,
    Response
} from "express";

import type {
    Marcaje
} from "../models/marcaje";

import { MarcajeService } from "../services/marcajes.service";
import { ES_LOCAL } from "../utils/utilidades";


// ======================================================
// HELPERS
// ======================================================

function esNumeroValido(
    valor: unknown
): valor is number {
    return (
        typeof valor === "number" &&
        Number.isFinite(valor)
    );
}


// ======================================================
// CONTROLADOR
// ======================================================

export const MarcajeController = {
    async getAll(
        _req: Request,
        res: Response
    ) {
        const data =
            await MarcajeService.findAll();

        return res.json(data);
    },


    async findMarcajeByEmpleadoAndFecha(
        req: Request,
        res: Response
    ) {
        if (ES_LOCAL) {
            console.log(
                "MarcajeController.findMarcajeByEmpleadoAndFecha:",
                JSON.stringify(
                    req.params
                )
            );
        }

        const idEmpleado =
            Number(
                req.params
                    .id_empleado
            );

        const fecha =
            req.params.fecha;


        if (
            !Number.isInteger(
                idEmpleado
            ) ||
            idEmpleado <= 0
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "El empleado es inválido."
                });
        }


        const data =
            await MarcajeService
                .findMarcajeByEmpleadoAndFecha(
                    idEmpleado,
                    fecha
                );

        return res.json(data);
    },


    // ======================================================
    // REGISTRAR MARCAJE
    // ======================================================

    async createMarcaje(
        req: Request,
        res: Response
    ) {
        const {
            empleado,
            es_entrada,
            hora,
            latitud,
            longitud
        } = req.body;


        // ======================================================
        // VALIDACIÓN GENERAL
        // ======================================================

        if (
            !Number.isInteger(
                empleado
            ) ||
            empleado <= 0
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "El empleado es obligatorio."
                });
        }


        if (
            typeof es_entrada !==
            "boolean"
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "El tipo de marcaje es obligatorio."
                });
        }


        if (
            typeof hora !==
                "string" ||
            hora.trim() === ""
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "La hora del marcaje es obligatoria."
                });
        }


        // ======================================================
        // VALIDACIÓN GPS
        // ======================================================

        if (
            !esNumeroValido(
                latitud
            ) ||
            !esNumeroValido(
                longitud
            )
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "No fue posible obtener una ubicación válida para el marcaje."
                });
        }


        if (
            latitud < -90 ||
            latitud > 90
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "La latitud obtenida no es válida."
                });
        }


        if (
            longitud < -180 ||
            longitud > 180
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "La longitud obtenida no es válida."
                });
        }


        const marcaje:
            Marcaje = {
                empleado,
                es_entrada,
                hora:
                    hora.trim(),
                latitud,
                longitud,
                fecha:
                    new Date()
            };


        // ======================================================
        // REGISTRO
        // ======================================================

        try {
            const resultado =
                await MarcajeService
                    .registrarMarcajeByEmpleadoData(
                        marcaje
                    );


            return res
                .status(201)
                .json(resultado);
        } catch (error) {
            console.error(
                "MarcajeController.createMarcaje:",
                error
            );


            if (
                error instanceof Error
            ) {
                if (
                    error.message.includes(
                        "Ya existe una entrada"
                    ) ||
                    error.message.includes(
                        "Ya existe una salida"
                    )
                ) {
                    return res
                        .status(409)
                        .json({
                            message:
                                error.message
                        });
                }


                if (
                    error.message ===
                    "El empleado no existe."
                ) {
                    return res
                        .status(404)
                        .json({
                            message:
                                error.message
                        });
                }
            }


            return res
                .status(500)
                .json({
                    message:
                        "No fue posible registrar el marcaje."
                });
        }
    },


    async findOne(
        req: Request,
        res: Response
    ) {
        const id =
            Number(
                req.params.id
            );

        const data =
            await MarcajeService.findOne(
                id
            );

        return res.json(data);
    },


    async create(
        req: Request,
        res: Response
    ) {
        const data =
            await MarcajeService.create(
                req.body
            );

        return res.json(data);
    }
};