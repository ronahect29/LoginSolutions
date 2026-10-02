import {
    Request,
    Response
} from "express";

import bcrypt from "bcryptjs";

import {
    UsuarioService
} from "../services/usuario.service";

import {
    MarcajesIntegrationService
} from "../services/marcajesIntegration.service";

import {
    BuscarUsuariosDto
} from "../models/Usuario";

import {
    prisma
} from "../prisma";

import {
    AuthRequest
} from "../types/AuthRequest";

import {
    ES_LOCAL
} from "../utils/constantes";

const SALT_ROUNDS =
    10;

function tieneAccesoPMW(
    configuraciones: Array<{
        rol_configuracion_usuario_rol_rolTorol: {
            aplicacion_rol_aplicacionToaplicacion: {
                codigo: string;
            };
        };
    }>
): boolean {
    return configuraciones.some(
        (
            configuracion
        ) =>
            configuracion
                .rol_configuracion_usuario_rol_rolTorol
                .aplicacion_rol_aplicacionToaplicacion
                .codigo
                .trim()
                .toUpperCase() ===
            "PMW"
    );
}

export const UsuarioController = {
    async getAll(
        _req: Request,
        res: Response
    ) {
        try {
            const data =
                await UsuarioService
                    .findAll();

            return res
                .status(200)
                .json(data);
        } catch (error) {
            console.error(
                "UsuarioController.getAll:",
                error
            );

            return res.status(500).json({
                message:
                    "Error interno"
            });
        }
    },

    async findByUsuarioId(
        req: Request,
        res: Response
    ) {
        try {
            const id =
                Number(
                    req.params.id
                );

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {
                return res.status(400).json({
                    message:
                        "ID de usuario inválido"
                });
            }

            const data =
                await UsuarioService
                    .findOne(id);

            if (!data) {
                return res.status(404).json({
                    message:
                        "Usuario no encontrado"
                });
            }

            return res
                .status(200)
                .json(data);
        } catch (error) {
            console.error(
                "UsuarioController.findByUsuarioId:",
                error
            );

            return res.status(500).json({
                message:
                    "Error interno"
            });
        }
    },

    async findAllWithRolesAndApps(
        _req: Request,
        res: Response
    ) {
        try {
            const data =
                await UsuarioService
                    .findAllWithRolesAndApp();

            return res
                .status(200)
                .json(data);
        } catch (error) {
            console.error(
                "UsuarioController.findAllWithRolesAndApps:",
                error
            );

            return res.status(500).json({
                message:
                    "Error interno"
            });
        }
    },

    async update(
        req: AuthRequest,
        res: Response
    ) {
        const idUsuario =
            Number(
                req.params.id
            );

        if (
            !Number.isInteger(idUsuario) ||
            idUsuario <= 0
        ) {
            return res.status(400).json({
                message:
                    "ID de usuario inválido"
            });
        }

        const {
            nombre,
            correo,
            username,
            direccion,
            telefono
        } =
            req.body;

        if (
            typeof nombre !== "string" ||
            !nombre.trim() ||
            nombre.trim().length > 75
        ) {
            return res.status(400).json({
                message:
                    "El nombre es obligatorio y no puede superar 75 caracteres."
            });
        }

        if (
            typeof correo !== "string" ||
            !correo.trim() ||
            correo.trim().length > 150
        ) {
            return res.status(400).json({
                message:
                    "El correo es obligatorio."
            });
        }

        const correoValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                correo.trim()
            );

        if (!correoValido) {
            return res.status(400).json({
                message:
                    "El correo electrónico no es válido."
            });
        }

        if (
            typeof username !== "string" ||
            !username.trim() ||
            username.trim().length > 50
        ) {
            return res.status(400).json({
                message:
                    "El nombre de usuario es obligatorio y no puede superar 50 caracteres."
            });
        }

        if (
            direccion !== null &&
            direccion !== undefined &&
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
            telefono !== null &&
            telefono !== undefined &&
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

        const idAdministrador =
            req.user?.id_usuario;

        if (!idAdministrador) {
            return res.status(401).json({
                message:
                    "No fue posible identificar al usuario autenticado."
            });
        }

        try {
            const usuarioOriginal =
                await prisma.usuario.findUnique({
                    where: {
                        id_usuario:
                            idUsuario
                    },

                    select: {
                        id_usuario:
                            true,

                        nombre:
                            true,

                        correo:
                            true,

                        username:
                            true,

                        direccion:
                            true,

                        telefono:
                            true,

                        configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario: {
                            where: {
                                activo:
                                    true
                            },

                            select: {
                                rol_configuracion_usuario_rol_rolTorol: {
                                    select: {
                                        aplicacion_rol_aplicacionToaplicacion: {
                                            select: {
                                                codigo:
                                                    true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

            if (!usuarioOriginal) {
                return res.status(404).json({
                    message:
                        "Usuario no encontrado"
                });
            }

            await UsuarioService
                .validarIdentidadDisponible(
                    idUsuario,
                    correo,
                    username
                );

            const accesoMarcajes =
                tieneAccesoPMW(
                    usuarioOriginal
                        .configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario
                );

            const authorizationHeader =
                req.headers.authorization;

            let sincronizacionMarcajes =
                false;

            if (accesoMarcajes) {
                if (!authorizationHeader) {
                    return res.status(400).json({
                        message:
                            "No se recibió el token para sincronizar Marcajes."
                    });
                }

                try {
                    const respuesta =
                        await MarcajesIntegrationService
                            .actualizarEmpleado(
                                idUsuario,
                                {
                                    nombre:
                                        nombre.trim(),

                                    correo:
                                        correo.trim(),

                                    username:
                                        username.trim(),

                                    direccion:
                                        typeof direccion ===
                                            "string"
                                            ? direccion.trim() ||
                                              null
                                            : null,

                                    telefono:
                                        typeof telefono ===
                                            "string"
                                            ? telefono.trim() ||
                                              null
                                            : null
                                },
                                authorizationHeader
                            );

                    sincronizacionMarcajes =
                        respuesta.sincronizado;
                } catch (
                    errorMarcajes
                ) {
                    return res.status(502).json({
                        message:
                            "No fue posible sincronizar la edición con Marcajes. No se realizaron cambios.",
                        detalle:
                            errorMarcajes instanceof Error
                                ? errorMarcajes.message
                                : "Error desconocido"
                    });
                }
            }

            try {
                const usuarioActualizado =
                    await UsuarioService
                        .actualizarUsuario(
                            idUsuario,
                            {
                                nombre:
                                    nombre.trim(),

                                correo:
                                    correo.trim(),

                                username:
                                    username.trim(),

                                direccion:
                                    typeof direccion ===
                                        "string"
                                        ? direccion.trim() ||
                                          null
                                        : null,

                                telefono:
                                    typeof telefono ===
                                        "string"
                                        ? telefono.trim() ||
                                          null
                                        : null
                            },
                            idAdministrador
                        );

                return res.status(200).json({
                    message:
                        "Usuario actualizado correctamente.",
                    sincronizacionMarcajes,
                    usuario:
                        usuarioActualizado
                });
            } catch (errorAuth) {
                if (
                    accesoMarcajes &&
                    authorizationHeader
                ) {
                    try {
                        await MarcajesIntegrationService
                            .actualizarEmpleado(
                                idUsuario,
                                {
                                    nombre:
                                        usuarioOriginal.nombre,

                                    correo:
                                        usuarioOriginal.correo,

                                    username:
                                        usuarioOriginal.username,

                                    direccion:
                                        usuarioOriginal.direccion,

                                    telefono:
                                        usuarioOriginal.telefono
                                },
                                authorizationHeader
                            );
                    } catch (
                        errorCompensacion
                    ) {
                        console.error(
                            "No fue posible compensar la edición en Marcajes:",
                            errorCompensacion
                        );
                    }
                }

                throw errorAuth;
            }
        } catch (error) {
            console.error(
                "UsuarioController.update:",
                error
            );

            if (
                error instanceof Error &&
                error.message ===
                    "CORREO_DUPLICADO"
            ) {
                return res.status(409).json({
                    message:
                        "El correo ya está registrado por otro usuario."
                });
            }

            if (
                error instanceof Error &&
                error.message ===
                    "USERNAME_DUPLICADO"
            ) {
                return res.status(409).json({
                    message:
                        "El nombre de usuario ya está registrado."
                });
            }

            return res.status(500).json({
                message:
                    "Error interno al actualizar usuario."
            });
        }
    },

    async resetPassword(
        req: AuthRequest,
        res: Response
    ) {
        const idUsuario =
            Number(
                req.params.id
            );

        const {
            password
        } =
            req.body;

        if (
            !Number.isInteger(idUsuario) ||
            idUsuario <= 0
        ) {
            return res.status(400).json({
                message:
                    "ID de usuario inválido."
            });
        }

        if (
            typeof password !== "string" ||
            password.length < 6
        ) {
            return res.status(400).json({
                message:
                    "La nueva contraseña debe tener al menos 6 caracteres."
            });
        }

        if (
            password.length >
            128
        ) {
            return res.status(400).json({
                message:
                    "La contraseña no puede superar 128 caracteres."
            });
        }

        const idAdministrador =
            req.user?.id_usuario;

        if (!idAdministrador) {
            return res.status(401).json({
                message:
                    "No fue posible identificar al usuario autenticado."
            });
        }

        try {
            const usuario =
                await prisma.usuario.findUnique({
                    where: {
                        id_usuario:
                            idUsuario
                    },

                    select: {
                        id_usuario:
                            true
                    }
                });

            if (!usuario) {
                return res.status(404).json({
                    message:
                        "Usuario no encontrado."
                });
            }

            const passwordCifrado =
                await bcrypt.hash(
                    password,
                    SALT_ROUNDS
                );

            await UsuarioService
                .resetPassword(
                    idUsuario,
                    passwordCifrado,
                    idAdministrador
                );

            return res.status(200).json({
                success:
                    true,

                message:
                    "Contraseña restablecida correctamente."
            });
        } catch (error) {
            console.error(
                "UsuarioController.resetPassword:",
                error
            );

            return res.status(500).json({
                message:
                    "No fue posible restablecer la contraseña."
            });
        }
    },

    async changeUsuarioActivoById(
        req: AuthRequest,
        res: Response
    ) {
        const idUsuario =
            Number(
                req.params.id
            );

        const {
            activo,
            motivo_baja
        } =
            req.body;

        if (
            !Number.isInteger(idUsuario) ||
            idUsuario <= 0
        ) {
            return res.status(400).json({
                message:
                    "ID de usuario inválido"
            });
        }

        if (
            typeof activo !==
            "boolean"
        ) {
            return res.status(400).json({
                message:
                    "El campo 'activo' debe ser booleano"
            });
        }

        const idAdministrador =
            req.user?.id_usuario;

        if (!idAdministrador) {
            return res.status(401).json({
                message:
                    "No fue posible identificar al usuario autenticado"
            });
        }

        if (
            activo === false &&
            idUsuario ===
                idAdministrador
        ) {
            return res.status(400).json({
                message:
                    "No puedes dar de baja tu propio usuario."
            });
        }

        if (
            activo === false
        ) {
            if (
                typeof motivo_baja !==
                    "string" ||
                motivo_baja.trim().length <
                    3
            ) {
                return res.status(400).json({
                    message:
                        "Debe indicar un motivo de baja."
                });
            }

            if (
                motivo_baja.trim().length >
                250
            ) {
                return res.status(400).json({
                    message:
                        "El motivo de baja no puede superar 250 caracteres."
                });
            }
        }

        try {
            const usuario =
                await prisma.usuario.findUnique({
                    where: {
                        id_usuario:
                            idUsuario
                    },

                    select: {
                        id_usuario:
                            true,

                        activo:
                            true,

                        motivo_baja:
                            true,

                        configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario: {
                            where: {
                                activo:
                                    true
                            },

                            select: {
                                rol_configuracion_usuario_rol_rolTorol: {
                                    select: {
                                        aplicacion_rol_aplicacionToaplicacion: {
                                            select: {
                                                codigo:
                                                    true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

            if (!usuario) {
                return res.status(404).json({
                    message:
                        "Usuario no encontrado"
                });
            }

            if (
                usuario.activo ===
                activo
            ) {
                return res.status(200).json({
                    success:
                        true,

                    message:
                        activo
                            ? "El usuario ya se encuentra activo."
                            : "El usuario ya se encuentra dado de baja."
                });
            }

            const accesoMarcajes =
                tieneAccesoPMW(
                    usuario
                        .configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario
                );

            const authorizationHeader =
                req.headers.authorization;

            let sincronizacionMarcajes =
                false;

            if (accesoMarcajes) {
                if (!authorizationHeader) {
                    return res.status(400).json({
                        message:
                            "No se recibió el token necesario para sincronizar Marcajes."
                    });
                }

                try {
                    const respuesta =
                        await MarcajesIntegrationService
                            .cambiarEstadoEmpleado(
                                idUsuario,
                                {
                                    activo,

                                    motivo_baja:
                                        activo
                                            ? null
                                            : motivo_baja.trim()
                                },
                                authorizationHeader
                            );

                    sincronizacionMarcajes =
                        respuesta.sincronizado;
                } catch (
                    errorMarcajes
                ) {
                    console.error(
                        "No fue posible sincronizar el estado con Marcajes:",
                        errorMarcajes
                    );

                    return res.status(502).json({
                        message:
                            "No se pudo sincronizar el estado del usuario con Marcajes. No se realizó el cambio.",
                        detalle:
                            errorMarcajes instanceof Error
                                ? errorMarcajes.message
                                : "Error desconocido"
                    });
                }
            }

            try {
                const usuarioActualizado =
                    await UsuarioService
                        .changeUsuarioActivoById(
                            idUsuario,
                            activo,
                            idAdministrador,
                            activo
                                ? null
                                : motivo_baja
                        );

                return res.status(200).json({
                    success:
                        true,

                    message:
                        activo
                            ? "Usuario reactivado correctamente."
                            : "Usuario dado de baja correctamente.",

                    sincronizacionMarcajes,

                    usuario:
                        usuarioActualizado
                });
            } catch (
                errorAuth
            ) {
                if (
                    accesoMarcajes &&
                    authorizationHeader
                ) {
                    try {
                        await MarcajesIntegrationService
                            .cambiarEstadoEmpleado(
                                idUsuario,
                                {
                                    activo:
                                        usuario.activo,

                                    motivo_baja:
                                        usuario.activo
                                            ? null
                                            : usuario.motivo_baja ||
                                              "Restauración automática"
                                },
                                authorizationHeader
                            );
                    } catch (
                        errorCompensacion
                    ) {
                        console.error(
                            "Error compensando Marcajes:",
                            errorCompensacion
                        );
                    }
                }

                throw errorAuth;
            }
        } catch (error) {
            console.error(
                "UsuarioController.changeUsuarioActivoById:",
                error
            );

            return res.status(500).json({
                message:
                    "Error interno del servidor"
            });
        }
    },

    async findByFilters(
        req: Request,
        res: Response
    ) {
        try {
            const filtros =
                req.body as
                    BuscarUsuariosDto;

            if (ES_LOCAL) {
                console.log(
                    "UsuarioController.findByFilters:",
                    JSON.stringify(
                        filtros
                    )
                );
            }

            const usuarios =
                await UsuarioService
                    .findByFilters(
                        filtros
                    );

            return res
                .status(200)
                .json(usuarios);
        } catch (error) {
            console.error(
                "UsuarioController.findByFilters:",
                error
            );

            return res.status(500).json({
                message:
                    "Error interno"
            });
        }
    },

    async create(
        req: AuthRequest,
        res: Response
    ) {
        try {
            const {
                user,
                roles
            } =
                req.body;

            if (!user) {
                return res.status(400).json({
                    message:
                        "Información del usuario requerida"
                });
            }

            if (
                !Array.isArray(roles) ||
                roles.length === 0
            ) {
                return res.status(400).json({
                    message:
                        "Debe asignarse al menos un rol"
                });
            }

            const tieneRolPorDefecto =
                roles.some(
                    (
                        rol:
                            any
                    ) =>
                        rol.default ===
                        true
                );

            if (!tieneRolPorDefecto) {
                return res.status(400).json({
                    message:
                        "Debe existir un rol por defecto"
                });
            }

            if (
                typeof user.password !==
                    "string" ||
                user.password.length <
                    6
            ) {
                return res.status(400).json({
                    message:
                        "La contraseña debe tener al menos 6 caracteres"
                });
            }

            const passwordCifrado =
                await bcrypt.hash(
                    user.password,
                    SALT_ROUNDS
                );

            const resultado =
                await UsuarioService
                    .createUsuarioWithRolConfig(
                        {
                            ...user,
                            password:
                                passwordCifrado
                        },
                        roles,
                        req.user?.id_usuario ||
                            0
                    );

            const accesoMarcajes =
                roles.some(
                    (
                        rol:
                            any
                    ) =>
                        typeof rol.codigo ===
                            "string" &&
                        rol.codigo
                            .trim()
                            .toUpperCase()
                            .endsWith(
                                "-PMW"
                            )
                );

            if (!accesoMarcajes) {
                return res
                    .status(201)
                    .json(resultado);
            }

            const authorizationHeader =
                req.headers.authorization;

            if (!authorizationHeader) {
                return res.status(201).json({
                    ...resultado,

                    sincronizacionMarcajes:
                        false,

                    advertencia:
                        "El usuario fue creado, pero no se recibió el token para registrarlo en Marcajes"
                });
            }

            try {
                const respuestaMarcajes =
                    await MarcajesIntegrationService
                        .crearEmpleado(
                            {
                                id_auth:
                                    resultado.usuarioId,

                                correo:
                                    user.correo,

                                nombre:
                                    user.nombre,

                                username:
                                    user.username,

                                direccion:
                                    user.direccion ||
                                    null,

                                telefono:
                                    user.telefono ||
                                    null
                            },
                            authorizationHeader
                        );

                return res.status(201).json({
                    ...resultado,

                    sincronizacionMarcajes:
                        true,

                    empleadoMarcajes:
                        respuestaMarcajes
                            .empleado
                });
            } catch (
                errorMarcajes
            ) {
                console.error(
                    "UsuarioController.create - error Marcajes:",
                    errorMarcajes
                );

                return res.status(201).json({
                    ...resultado,

                    sincronizacionMarcajes:
                        false,

                    advertencia:
                        "El usuario fue creado, pero no pudo registrarse automáticamente en Marcajes",

                    detalle:
                        errorMarcajes instanceof Error
                            ? errorMarcajes.message
                            : "Error desconocido"
                });
            }
        } catch (
            error:
                any
        ) {
            console.error(
                "UsuarioController.create:",
                error
            );

            if (
                error.message ===
                "Correo o username ya registrados"
            ) {
                return res.status(409).json({
                    message:
                        error.message
                });
            }

            return res.status(500).json({
                message:
                    "Error interno al crear usuario"
            });
        }
    }
};