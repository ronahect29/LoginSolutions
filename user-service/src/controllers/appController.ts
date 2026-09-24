import {
    type Request,
    type Response,
} from "express";

import * as appService from "../services/appService";

// ======================================================
// HELPERS
// ======================================================

function manejarError(
    err: unknown,
    res: Response
) {
    const codigo =
        err instanceof Error
            ? err.message
            : "";

    switch (codigo) {
        case "APLICACION_NO_ENCONTRADA":
            return res.status(404).json({
                message:
                    "Aplicación no encontrada.",
            });

        case "CODIGO_APLICACION_DUPLICADO":
            return res.status(409).json({
                message:
                    "Ya existe una aplicación con ese código.",
            });

        default:
            console.error(
                "appController - error:",
                err
            );

            return res.status(500).json({
                message:
                    "Error interno del servidor.",
            });
    }
}

function validarPayload(
    body: Record<string, unknown>
): string | null {
    const {
        nombre,
        codigo,
        descripcion,
        activo,
    } = body;

    if (
        typeof nombre !== "string" ||
        nombre.trim() === ""
    ) {
        return "El nombre es obligatorio.";
    }

    if (
        nombre.trim().length >
        100
    ) {
        return "El nombre no puede superar 100 caracteres.";
    }

    if (
        typeof codigo !== "string" ||
        codigo.trim() === ""
    ) {
        return "El código es obligatorio.";
    }

    if (
        codigo.trim().length >
        10
    ) {
        return "El código no puede superar 10 caracteres.";
    }

    if (
        typeof descripcion !== "string" ||
        descripcion.trim() === ""
    ) {
        return "La descripción es obligatoria.";
    }

    if (
        descripcion.trim().length >
        150
    ) {
        return "La descripción no puede superar 150 caracteres.";
    }

    if (
        typeof activo !==
        "boolean"
    ) {
        return "El estado es inválido.";
    }

    return null;
}

// ======================================================
// LISTADO
// ======================================================

export async function getApps(
    _req: Request,
    res: Response
) {
    try {
        const apps =
            await appService.getApps();

        return res.json(
            apps
        );
    } catch (err) {
        return manejarError(
            err,
            res
        );
    }
}

// ======================================================
// CREACIÓN
// ======================================================

export async function createApp(
    req: Request,
    res: Response
) {
    try {
        const error =
            validarPayload(
                req.body
            );

        if (error) {
            return res.status(400).json({
                message:
                    error,
            });
        }

        const creada =
            await appService.createApp({
                nombre:
                    req.body.nombre,

                codigo:
                    req.body.codigo,

                descripcion:
                    req.body.descripcion,

                activo:
                    req.body.activo,
            });

        return res
            .status(201)
            .json(
                creada
            );
    } catch (err) {
        return manejarError(
            err,
            res
        );
    }
}

// ======================================================
// ACTUALIZACIÓN
// ======================================================

export async function updateApp(
    req: Request,
    res: Response
) {
    try {
        const idAplicacion =
            Number(
                req.params.id
            );

        if (
            !Number.isInteger(
                idAplicacion
            ) ||
            idAplicacion <= 0
        ) {
            return res.status(400).json({
                message:
                    "Identificador de aplicación inválido.",
            });
        }

        const error =
            validarPayload(
                req.body
            );

        if (error) {
            return res.status(400).json({
                message:
                    error,
            });
        }

        const actualizada =
            await appService.updateApp(
                idAplicacion,
                {
                    nombre:
                        req.body.nombre,

                    codigo:
                        req.body.codigo,

                    descripcion:
                        req.body
                            .descripcion,

                    activo:
                        req.body.activo,
                }
            );

        return res.json(
            actualizada
        );
    } catch (err) {
        return manejarError(
            err,
            res
        );
    }
}

// ======================================================
// CAMBIO DE ESTADO
// ======================================================

export async function changeAppActivo(
    req: Request,
    res: Response
) {
    try {
        const idAplicacion =
            Number(
                req.params.id
            );

        const {
            activo,
        } = req.body;

        if (
            !Number.isInteger(
                idAplicacion
            ) ||
            idAplicacion <= 0
        ) {
            return res.status(400).json({
                message:
                    "Identificador de aplicación inválido.",
            });
        }

        if (
            typeof activo !==
            "boolean"
        ) {
            return res.status(400).json({
                message:
                    "El estado es inválido.",
            });
        }

        const actualizada =
            await appService.changeAppActivo(
                idAplicacion,
                activo
            );

        return res.json(
            actualizada
        );
    } catch (err) {
        return manejarError(
            err,
            res
        );
    }
}