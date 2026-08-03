import type { Request, Response } from "express";

import {
    EmpleadoService,
    type ActualizarEmpleadoOperativoDto
} from "../services/empleado.service";

function obtenerIdParametro(valor: string): number | null {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

function tienePropiedad(
    objeto: Record<string, unknown>,
    propiedad: string
): boolean {
    return Object.prototype.hasOwnProperty.call(
        objeto,
        propiedad
    );
}

function obtenerEnteroOpcional(
    valor: unknown
): number | null | undefined {
    if (valor === undefined) {
        return undefined;
    }

    if (valor === null || valor === "") {
        return null;
    }

    const numero = Number(valor);

    if (!Number.isInteger(numero) || numero <= 0) {
        return undefined;
    }

    return numero;
}

function responderErrorServicio(
    error: unknown,
    res: Response
): Response {
    console.error(
        "Error en empleado.controller:",
        error
    );

    if (error instanceof Error) {
        if (error.message.includes("no existe")) {
            return res.status(404).json({
                message: error.message
            });
        }

        if (
            error.message.includes("inactiva") ||
            error.message.includes("propio supervisor")
        ) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    return res.status(500).json({
        message:
            "Ocurrió un error procesando la información del empleado."
    });
}

export const EmpleadoController = {
    /**
     * Lista todos los empleados con información
     * operativa, sucursal, supervisor y último marcaje.
     */
    async getAll(
        _req: Request,
        res: Response
    ) {
        try {
            const empleados =
                await EmpleadoService.findAll();

            return res.status(200).json(empleados);
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    /**
     * Obtiene un empleado por su identificador.
     */
    async findOne(
        req: Request,
        res: Response
    ) {
        const idEmpleado = obtenerIdParametro(
            req.params.id
        );

        if (idEmpleado === null) {
            return res.status(400).json({
                message:
                    "El identificador del empleado es inválido."
            });
        }

        try {
            const empleado =
                await EmpleadoService.findOne(
                    idEmpleado
                );

            if (!empleado) {
                return res.status(404).json({
                    message:
                        "Empleado no encontrado."
                });
            }

            return res.status(200).json(empleado);
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    /**
     * Lista los motoristas asignados a un supervisor.
     */
    async findEquipoPorSupervisor(
        req: Request,
        res: Response
    ) {
        const idSupervisor = obtenerIdParametro(
            req.params.idSupervisor
        );

        if (idSupervisor === null) {
            return res.status(400).json({
                message:
                    "El identificador del supervisor es inválido."
            });
        }

        try {
            const equipo =
                await EmpleadoService
                    .findEquipoPorSupervisor(
                        idSupervisor
                    );

            return res.status(200).json(equipo);
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    /**
     * Lista empleados sin supervisor asignado.
     */
    async findSinSupervisor(
        _req: Request,
        res: Response
    ) {
        try {
            const empleados =
                await EmpleadoService
                    .findSinSupervisor();

            return res.status(200).json(empleados);
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    async findByByCorreoAndIdAuth(
        req: Request,
        res: Response
    ) {
        const correo = req.params.correo?.trim();
        const idAuth = Number(req.params.id_auth);

        if (
            !correo ||
            !Number.isInteger(idAuth) ||
            idAuth <= 0
        ) {
            return res.status(400).json({
                message:
                    "Correo e id_auth son obligatorios."
            });
        }

        try {
            const empleados =
                await EmpleadoService
                    .findByCorreoAndIdAuth(
                        correo,
                        idAuth
                    );

            return res.status(200).json(empleados);
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    /**
     * Crea el registro operativo del empleado.
     *
     * Este método continúa siendo utilizado por
     * la integración con user-service.
     */
    async create(
        req: Request,
        res: Response
    ) {
        const {
            id_auth,
            correo,
            nombre,
            username,
            direccion,
            telefono,
            sucursal,
            jefe
        } = req.body;

        const idAuth = Number(id_auth);

        if (
            !Number.isInteger(idAuth) ||
            idAuth <= 0
        ) {
            return res.status(400).json({
                message:
                    "El campo id_auth es obligatorio y debe ser válido."
            });
        }

        if (
            typeof correo !== "string" ||
            !correo.trim()
        ) {
            return res.status(400).json({
                message:
                    "El correo es obligatorio."
            });
        }

        if (correo.trim().length > 150) {
            return res.status(400).json({
                message:
                    "El correo no puede superar 150 caracteres."
            });
        }

        if (
            typeof nombre !== "string" ||
            !nombre.trim()
        ) {
            return res.status(400).json({
                message:
                    "El nombre es obligatorio."
            });
        }

        if (nombre.trim().length > 75) {
            return res.status(400).json({
                message:
                    "El nombre no puede superar 75 caracteres."
            });
        }

        if (
            typeof username !== "string" ||
            !username.trim()
        ) {
            return res.status(400).json({
                message:
                    "El nombre de usuario es obligatorio."
            });
        }

        if (username.trim().length > 50) {
            return res.status(400).json({
                message:
                    "El nombre de usuario no puede superar 50 caracteres."
            });
        }

        if (
            direccion !== undefined &&
            direccion !== null &&
            (
                typeof direccion !== "string" ||
                direccion.trim().length > 150
            )
        ) {
            return res.status(400).json({
                message:
                    "La dirección no puede superar 150 caracteres."
            });
        }

        if (
            telefono !== undefined &&
            telefono !== null &&
            (
                typeof telefono !== "string" ||
                telefono.trim().length > 15
            )
        ) {
            return res.status(400).json({
                message:
                    "El teléfono no puede superar 15 caracteres."
            });
        }

        const idSucursal =
            obtenerEnteroOpcional(sucursal);

        if (
            sucursal !== undefined &&
            sucursal !== null &&
            sucursal !== "" &&
            idSucursal === undefined
        ) {
            return res.status(400).json({
                message:
                    "La sucursal seleccionada es inválida."
            });
        }

        const idJefe =
            obtenerEnteroOpcional(jefe);

        if (
            jefe !== undefined &&
            jefe !== null &&
            jefe !== "" &&
            idJefe === undefined
        ) {
            return res.status(400).json({
                message:
                    "El supervisor seleccionado es inválido."
            });
        }

        try {
            const empleado =
                await EmpleadoService.create({
                    id_auth: idAuth,
                    correo: correo.trim(),
                    nombre: nombre.trim(),
                    username: username.trim(),

                    direccion:
                        typeof direccion === "string" &&
                        direccion.trim()
                            ? direccion.trim()
                            : null,

                    telefono:
                        typeof telefono === "string" &&
                        telefono.trim()
                            ? telefono.trim()
                            : null,

                    sucursal: idSucursal ?? null,
                    jefe: idJefe ?? null
                });

            return res.status(201).json({
                message:
                    "Empleado registrado correctamente.",
                empleado
            });
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    /**
     * Actualiza sucursal, supervisor, teléfono
     * y dirección del empleado.
     */
    async actualizarDatosOperativos(
        req: Request,
        res: Response
    ) {
        const idEmpleado = obtenerIdParametro(
            req.params.id
        );

        if (idEmpleado === null) {
            return res.status(400).json({
                message:
                    "El identificador del empleado es inválido."
            });
        }

        const cuerpo =
            req.body as Record<string, unknown>;

        const datos: ActualizarEmpleadoOperativoDto = {};

        if (tienePropiedad(cuerpo, "direccion")) {
            const direccion = cuerpo.direccion;

            if (
                direccion !== null &&
                (
                    typeof direccion !== "string" ||
                    direccion.trim().length > 150
                )
            ) {
                return res.status(400).json({
                    message:
                        "La dirección debe ser texto y no superar 150 caracteres."
                });
            }

            datos.direccion =
                typeof direccion === "string" &&
                direccion.trim()
                    ? direccion.trim()
                    : null;
        }

        if (tienePropiedad(cuerpo, "telefono")) {
            const telefono = cuerpo.telefono;

            if (
                telefono !== null &&
                (
                    typeof telefono !== "string" ||
                    telefono.trim().length > 15
                )
            ) {
                return res.status(400).json({
                    message:
                        "El teléfono debe ser texto y no superar 15 caracteres."
                });
            }

            datos.telefono =
                typeof telefono === "string" &&
                telefono.trim()
                    ? telefono.trim()
                    : null;
        }

        if (tienePropiedad(cuerpo, "sucursal")) {
            const sucursal =
                obtenerEnteroOpcional(
                    cuerpo.sucursal
                );

            if (
                cuerpo.sucursal !== null &&
                cuerpo.sucursal !== "" &&
                sucursal === undefined
            ) {
                return res.status(400).json({
                    message:
                        "La sucursal seleccionada es inválida."
                });
            }

            datos.sucursal = sucursal ?? null;
        }

        if (tienePropiedad(cuerpo, "jefe")) {
            const jefe =
                obtenerEnteroOpcional(
                    cuerpo.jefe
                );

            if (
                cuerpo.jefe !== null &&
                cuerpo.jefe !== "" &&
                jefe === undefined
            ) {
                return res.status(400).json({
                    message:
                        "El supervisor seleccionado es inválido."
                });
            }

            datos.jefe = jefe ?? null;
        }

        if (Object.keys(datos).length === 0) {
            return res.status(400).json({
                message:
                    "No se proporcionaron datos para actualizar."
            });
        }

        try {
            const empleado =
                await EmpleadoService
                    .actualizarDatosOperativos(
                        idEmpleado,
                        datos
                    );

            return res.status(200).json({
                message:
                    "Información operativa actualizada correctamente.",
                empleado
            });
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    }
};