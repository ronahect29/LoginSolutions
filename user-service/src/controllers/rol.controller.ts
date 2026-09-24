import {
    type Request,
    type Response,
} from "express";

import * as rolService from "../services/rol.service";

// ======================================================
// HELPERS
// ======================================================

function manejarErrorAdmin(
    err: unknown,
    res: Response
) {
    const codigo =
        err instanceof Error
            ? err.message
            : "";

    switch (codigo) {
        case "ROL_NO_ENCONTRADO":
            return res.status(404).json({
                message:
                    "Rol no encontrado",
            });

        case "APLICACION_NO_ENCONTRADA":
            return res.status(404).json({
                message:
                    "Aplicación no encontrada",
            });

        case "CODIGO_ROL_DUPLICADO":
            return res.status(409).json({
                message:
                    "Ya existe un rol con ese código",
            });

        default:
            console.error(
                "rol.controller - error:",
                err
            );

            return res.status(500).json({
                message:
                    "Error interno del servidor",
            });
    }
}

function validarPayloadRol(
    body: Record<string, unknown>
) {
    const {
        nombre,
        codigo,
        descripcion,
        activo,
        id_aplicacion,
    } = body;

    if (
        typeof nombre !== "string" ||
        nombre.trim() === ""
    ) {
        return "El nombre es obligatorio";
    }

    if (
        typeof codigo !== "string" ||
        codigo.trim() === ""
    ) {
        return "El código es obligatorio";
    }

    if (
        codigo.trim().length > 10
    ) {
        return "El código no puede superar 10 caracteres";
    }

    if (
        typeof descripcion !== "string" ||
        descripcion.trim() === ""
    ) {
        return "La descripción es obligatoria";
    }

    if (
        typeof activo !== "boolean"
    ) {
        return "El estado del rol es inválido";
    }

    if (
        typeof id_aplicacion !== "number" ||
        !Number.isInteger(
            id_aplicacion
        ) ||
        id_aplicacion <= 0
    ) {
        return "La aplicación es obligatoria";
    }

    return null;
}

// ======================================================
// CONSULTAS DE ROLES PARA USUARIOS
// ======================================================

export async function getRolesByActivoAndApp(
    req: Request,
    res: Response
) {
    try {
        const {
            activo,
            id_app,
        } = req.params;

        if (
            !activo ||
            (
                activo !== "true" &&
                activo !== "false"
            )
        ) {
            console.error(
                "rol.controller - getRolesByActivoAndApp: Param 'activo' inválido"
            );

            return res.status(400).json({
                message:
                    "Param 'activo' inválido",
            });
        }

        if (
            !id_app ||
            isNaN(
                Number(id_app)
            )
        ) {
            console.error(
                "rol.controller - getRolesByActivoAndApp: Param 'id_app' inválido"
            );

            return res.status(400).json({
                message:
                    "Param 'id_app' inválido",
            });
        }

        const activoBool =
            activo === "true";

        const roles =
            await rolService.RolService
                .findRolesByActivoAndApp(
                    activoBool,
                    Number(id_app)
                );

        return res.json(
            roles
        );
    } catch (err) {
        console.error(
            "rol.controller - getRolesByActivoAndApp:",
            err
        );

        return res.status(500).json({
            message:
                "Error interno del servidor",
        });
    }
}

export async function getRolesByActivoAndCodigosAplicacionActivo(
    req: Request,
    res: Response
) {
    try {
        const {
            activo,
            appsCodes,
        } = req.body;

        if (
            activo === undefined ||
            typeof activo !==
                "boolean"
        ) {
            console.error(
                "rol.controller - getRolesByActivoAndCodigosAplicacionActivo: Param 'activo' inválido"
            );

            return res.status(400).json({
                message:
                    "Param 'activo' inválido",
            });
        }

        if (
            !appsCodes ||
            !Array.isArray(
                appsCodes
            ) ||
            appsCodes.some(
                (code) =>
                    typeof code !==
                    "string"
            )
        ) {
            console.error(
                "rol.controller - getRolesByActivoAndCodigosAplicacionActivo: Param 'appsCodes' inválido"
            );

            return res.status(400).json({
                message:
                    "Param 'appsCodes' inválido",
            });
        }

        const roles =
            await rolService.RolService
                .findRolesByActivoAndCodigosAplicacionActivo(
                    activo,
                    appsCodes
                );

        return res.json(
            roles
        );
    } catch (err) {
        console.error(
            "rol.controller - getRolesByActivoAndCodigosAplicacionActivo:",
            err
        );

        return res.status(500).json({
            message:
                "Error interno del servidor",
        });
    }
}

// ======================================================
// LISTADO ADMINISTRATIVO
// ======================================================

export async function getRolesAdmin(
    _req: Request,
    res: Response
) {
    try {
        const roles =
            await rolService.RolService
                .findAllAdmin();

        return res.json(
            roles
        );
    } catch (err) {
        return manejarErrorAdmin(
            err,
            res
        );
    }
}

// ======================================================
// CREACIÓN
// ======================================================

export async function createRolAdmin(
    req: Request,
    res: Response
) {
    try {
        const error =
            validarPayloadRol(
                req.body
            );

        if (error) {
            return res.status(400).json({
                message: error,
            });
        }

        const creado =
            await rolService.RolService
                .createAdmin({
                    nombre:
                        req.body.nombre,

                    codigo:
                        req.body.codigo,

                    descripcion:
                        req.body.descripcion,

                    activo:
                        req.body.activo,

                    id_aplicacion:
                        req.body
                            .id_aplicacion,
                });

        return res.status(201).json(
            creado
        );
    } catch (err) {
        return manejarErrorAdmin(
            err,
            res
        );
    }
}

// ======================================================
// ACTUALIZACIÓN
// ======================================================

export async function updateRolAdmin(
    req: Request,
    res: Response
) {
    try {
        const idRol =
            Number(
                req.params.id_rol
            );

        if (
            !Number.isInteger(
                idRol
            ) ||
            idRol <= 0
        ) {
            return res.status(400).json({
                message:
                    "Identificador de rol inválido",
            });
        }

        const error =
            validarPayloadRol(
                req.body
            );

        if (error) {
            return res.status(400).json({
                message: error,
            });
        }

        const actualizado =
            await rolService.RolService
                .updateAdmin(
                    idRol,
                    {
                        nombre:
                            req.body
                                .nombre,

                        codigo:
                            req.body
                                .codigo,

                        descripcion:
                            req.body
                                .descripcion,

                        activo:
                            req.body
                                .activo,

                        id_aplicacion:
                            req.body
                                .id_aplicacion,
                    }
                );

        return res.json(
            actualizado
        );
    } catch (err) {
        return manejarErrorAdmin(
            err,
            res
        );
    }
}

// ======================================================
// CAMBIO DE ESTADO
// ======================================================

export async function changeActivoRolAdmin(
    req: Request,
    res: Response
) {
    try {
        const idRol =
            Number(
                req.params.id_rol
            );

        const {
            activo,
        } = req.body;

        if (
            !Number.isInteger(
                idRol
            ) ||
            idRol <= 0
        ) {
            return res.status(400).json({
                message:
                    "Identificador de rol inválido",
            });
        }

        if (
            typeof activo !==
            "boolean"
        ) {
            return res.status(400).json({
                message:
                    "El estado es inválido",
            });
        }

        const actualizado =
            await rolService.RolService
                .changeActivoAdmin(
                    idRol,
                    activo
                );

        return res.json(
            actualizado
        );
    } catch (err) {
        return manejarErrorAdmin(
            err,
            res
        );
    }
}