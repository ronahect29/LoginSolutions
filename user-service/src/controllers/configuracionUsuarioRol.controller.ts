import type {
    Request,
    Response
} from "express";

import {
    ConfiguracionUsuarioRolService,
    type AccesoRolInput
} from "../services/configuracionUsuarioRol.service";

import {
    MarcajesIntegrationService
} from "../services/marcajesIntegration.service";

import type {
    AuthRequest
} from "../types/AuthRequest";


function obtenerId(
    valor:
        string
): number | null {
    const id =
        Number(
            valor
        );


    if (
        !Number.isInteger(
            id
        ) ||
        id <=
            0
    ) {
        return null;
    }


    return id;
}


function obtenerRolesPayload(
    valor:
        unknown
): AccesoRolInput[] | null {
    if (
        !Array.isArray(
            valor
        ) ||
        valor.length ===
            0
    ) {
        return null;
    }


    const roles:
        AccesoRolInput[] =
        [];


    for (
        const item
        of valor
    ) {
        if (
            typeof item !==
                "object" ||
            item ===
                null
        ) {
            return null;
        }


        const rol =
            item as
                Record<
                    string,
                    unknown
                >;


        if (
            typeof rol.id_rol !==
                "number" ||
            !Number.isInteger(
                rol.id_rol
            ) ||
            rol.id_rol <=
                0 ||
            typeof rol.default !==
                "boolean"
        ) {
            return null;
        }


        roles.push({
            id_rol:
                rol.id_rol,

            default:
                rol.default
        });
    }


    return roles;
}


function responderErrorDominio(
    error:
        unknown,

    res:
        Response
) {
    console.error(
        "ConfiguracionUsuarioRolController:",
        error
    );


    if (
        error instanceof
        Error
    ) {
        switch (
            error.message
        ) {
            case "USUARIO_NO_ENCONTRADO":
                return res
                    .status(404)
                    .json({
                        message:
                            "Usuario no encontrado."
                    });

            case "USUARIO_INACTIVO":
                return res
                    .status(400)
                    .json({
                        message:
                            "Reactiva el usuario antes de modificar sus roles y accesos."
                    });

            case "ACCESOS_SIN_ROLES":
                return res
                    .status(400)
                    .json({
                        message:
                            "Debe asignarse al menos un rol."
                    });

            case "ROL_DUPLICADO":
                return res
                    .status(400)
                    .json({
                        message:
                            "La selección contiene roles duplicados."
                    });

            case "ROL_PRINCIPAL_INVALIDO":
                return res
                    .status(400)
                    .json({
                        message:
                            "Debe existir exactamente un rol principal."
                    });

            case "ROL_INVALIDO":
            case "ROL_NO_DISPONIBLE":
                return res
                    .status(400)
                    .json({
                        message:
                            "Uno o más roles seleccionados no se encuentran disponibles."
                    });

            case "AUTO_BLOQUEO_ADMIN":
                return res
                    .status(400)
                    .json({
                        message:
                            "No puedes quitarte tu propio rol de Superadministrador."
                    });
        }
    }


    return res
        .status(500)
        .json({
            message:
                "Error interno al gestionar los accesos del usuario."
        });
}


export const ConfiguracionUsuarioRolController = {
    async findAll(
        _req:
            Request,

        res:
            Response
    ) {
        try {
            const data =
                await ConfiguracionUsuarioRolService
                    .findAll();


            return res.json(
                data
            );
        } catch (
            error
        ) {
            console.error(
                "Error en findAll:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Error interno"
                });
        }
    },


    async findOne(
        req:
            Request,

        res:
            Response
    ) {
        try {
            const id =
                obtenerId(
                    req.params.id
                );


            if (
                id ===
                null
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Identificador inválido."
                    });
            }


            const data =
                await ConfiguracionUsuarioRolService
                    .findOne(
                        id
                    );


            return res.json(
                data
            );
        } catch (
            error
        ) {
            console.error(
                "Error en findOne:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Error interno"
                });
        }
    },


    async findRolesByUsuarioIdAndAplicacionCodigo(
        req:
            Request,

        res:
            Response
    ) {
        try {
            const id =
                obtenerId(
                    req.params.id
                );


            if (
                id ===
                null
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Identificador inválido."
                    });
            }


            const codeApp =
                String(
                    req.params.codeApp
                );


            const data =
                await ConfiguracionUsuarioRolService
                    .findRolesByUsuarioIdAndAplicacionCodigo(
                        id,
                        codeApp
                    );


            return res.json(
                data
            );
        } catch (
            error
        ) {
            console.error(
                "Error en findRolesByUsuarioIdAndAplicacionCodigo:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Error interno"
                });
        }
    },


    async create(
        req:
            Request,

        res:
            Response
    ) {
        try {
            const data =
                await ConfiguracionUsuarioRolService
                    .create(
                        req.body
                    );


            return res
                .status(201)
                .json(
                    data
                );
        } catch (
            error
        ) {
            console.error(
                "Error en create:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Error interno"
                });
        }
    },


    async findAccessByUsuarioId(
        req:
            AuthRequest,

        res:
            Response
    ) {
        const idUsuario =
            obtenerId(
                req.params.id
            );


        if (
            idUsuario ===
            null
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "Identificador de usuario inválido."
                });
        }


        try {
            const data =
                await ConfiguracionUsuarioRolService
                    .findAccessByUsuarioId(
                        idUsuario
                    );


            return res
                .status(200)
                .json(
                    data
                );
        } catch (
            error
        ) {
            return responderErrorDominio(
                error,
                res
            );
        }
    },


    async updateAccessByUsuarioId(
        req:
            AuthRequest,

        res:
            Response
    ) {
        const idUsuario =
            obtenerId(
                req.params.id
            );


        if (
            idUsuario ===
            null
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "Identificador de usuario inválido."
                });
        }


        const idAdministrador =
            req.user
                ?.id_usuario;


        if (
            !idAdministrador
        ) {
            return res
                .status(401)
                .json({
                    message:
                        "No fue posible identificar al administrador."
                });
        }


        const roles =
            obtenerRolesPayload(
                req.body
                    ?.roles
            );


        if (!roles) {
            return res
                .status(400)
                .json({
                    message:
                        "Debe seleccionar al menos un rol válido."
                });
        }


        if (
            roles.filter(
                (
                    rol
                ) =>
                    rol.default
            ).length !==
            1
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "Debe existir exactamente un rol principal."
                });
        }


        let preparacion:
            Awaited<
                ReturnType<
                    typeof ConfiguracionUsuarioRolService.prepararActualizacion
                >
            >;


        try {
            preparacion =
                await ConfiguracionUsuarioRolService
                    .prepararActualizacion(
                        idUsuario,
                        roles,
                        idAdministrador
                    );
        } catch (
            error
        ) {
            return responderErrorDominio(
                error,
                res
            );
        }


        const {
            usuario,
            teniaAccesoPMW,
            tendraAccesoPMW
        } =
            preparacion;


        const authorizationHeader =
            req.headers
                .authorization;


        const requiereAltaMarcajes =
            !teniaAccesoPMW &&
            tendraAccesoPMW;


        const requiereBajaMarcajes =
            teniaAccesoPMW &&
            !tendraAccesoPMW;


        if (
            (
                requiereAltaMarcajes ||
                requiereBajaMarcajes
            ) &&
            !authorizationHeader
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "No se recibió el token necesario para sincronizar Marcajes."
                });
        }


        let cambioMarcajes:
            "alta" |
            "baja" |
            null =
            null;


        let sincronizacionMarcajes =
            false;


        /*
         * Primero sincronizamos Marcajes.
         * Si después falla AUTH, compensamos el cambio.
         */
        try {
            if (
                requiereAltaMarcajes &&
                authorizationHeader
            ) {
                await MarcajesIntegrationService
                    .crearEmpleado(
                        {
                            id_auth:
                                usuario.id_usuario,

                            correo:
                                usuario.correo,

                            nombre:
                                usuario.nombre,

                            username:
                                usuario.username,

                            direccion:
                                usuario.direccion,

                            telefono:
                                usuario.telefono
                        },
                        authorizationHeader
                    );


                const estado =
                    await MarcajesIntegrationService
                        .cambiarEstadoEmpleado(
                            usuario.id_usuario,
                            {
                                activo:
                                    true,

                                motivo_baja:
                                    null
                            },
                            authorizationHeader
                        );


                if (
                    !estado.sincronizado
                ) {
                    throw new Error(
                        "Marcajes no confirmó la activación del empleado."
                    );
                }


                sincronizacionMarcajes =
                    true;

                cambioMarcajes =
                    "alta";
            }


            if (
                requiereBajaMarcajes &&
                authorizationHeader
            ) {
                const estado =
                    await MarcajesIntegrationService
                        .cambiarEstadoEmpleado(
                            usuario.id_usuario,
                            {
                                activo:
                                    false,

                                motivo_baja:
                                    "Acceso a Plataforma de Marcajes retirado desde Administración."
                            },
                            authorizationHeader
                        );


                sincronizacionMarcajes =
                    estado.sincronizado;

                cambioMarcajes =
                    "baja";
            }
        } catch (
            errorMarcajes
        ) {
            console.error(
                "Error sincronizando accesos con Marcajes:",
                errorMarcajes
            );


            /*
             * Si se alcanzó a crear/reactivar al empleado
             * pero la sincronización no terminó correctamente,
             * intentamos devolverlo a estado inactivo.
             */
            if (
                requiereAltaMarcajes &&
                authorizationHeader
            ) {
                try {
                    await MarcajesIntegrationService
                        .cambiarEstadoEmpleado(
                            usuario.id_usuario,
                            {
                                activo:
                                    false,

                                motivo_baja:
                                    "Restauración automática por error al asignar acceso PMW."
                            },
                            authorizationHeader
                        );
                } catch (
                    errorCompensacion
                ) {
                    console.error(
                        "No fue posible compensar el alta en Marcajes:",
                        errorCompensacion
                    );
                }
            }


            return res
                .status(502)
                .json({
                    message:
                        "No fue posible sincronizar el acceso con Marcajes. No se modificaron los roles del usuario.",

                    detalle:
                        errorMarcajes instanceof
                            Error
                            ? errorMarcajes.message
                            : "Error desconocido"
                });
        }


        try {
            const accesos =
                await ConfiguracionUsuarioRolService
                    .actualizarAccesos(
                        idUsuario,
                        roles,
                        idAdministrador
                    );


            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Roles y accesos actualizados correctamente.",

                    sincronizacionMarcajes,

                    requiereNuevoInicioSesion:
                        true,

                    accesos
                });
        } catch (
            errorActualizacion
        ) {
            /*
             * Si AUTH falla después de modificar Marcajes,
             * intentamos regresar Marcajes al estado anterior.
             */
            if (
                cambioMarcajes &&
                authorizationHeader
            ) {
                try {
                    if (
                        cambioMarcajes ===
                        "alta"
                    ) {
                        await MarcajesIntegrationService
                            .cambiarEstadoEmpleado(
                                usuario.id_usuario,
                                {
                                    activo:
                                        false,

                                    motivo_baja:
                                        "Restauración automática por error al actualizar roles."
                                },
                                authorizationHeader
                            );
                    }


                    if (
                        cambioMarcajes ===
                        "baja"
                    ) {
                        await MarcajesIntegrationService
                            .cambiarEstadoEmpleado(
                                usuario.id_usuario,
                                {
                                    activo:
                                        true,

                                    motivo_baja:
                                        null
                                },
                                authorizationHeader
                            );
                    }
                } catch (
                    errorCompensacion
                ) {
                    console.error(
                        "Error compensando Marcajes:",
                        errorCompensacion
                    );
                }
            }


            return responderErrorDominio(
                errorActualizacion,
                res
            );
        }
    }
};