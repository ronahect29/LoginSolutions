import {
    Prisma
} from "@prisma/client";

import {
    PagedResult
} from "../models/PagedResult";

import {
    BuscarUsuariosDto,
    CreateUserDto,
    UpdateUserDto,
    UsuarioAdminTable
} from "../models/Usuario";

import {
    RolConfigUsuario
} from "../models/Rol";

import {
    prisma
} from "../prisma";

import {
    cleanDate,
    formatDateTime
} from "../utils/utilDates";

const seleccionUsuarioSeguro = {
    id_usuario: true,
    correo: true,
    nombre: true,
    username: true,
    direccion: true,
    telefono: true,
    activo: true,
    reintentos: true,
    bloqueado_hasta: true,
    ultimo_inicio: true,
    fecha_creacion: true,
    fecha_modificacion: true,
    fecha_baja: true,
    motivo_baja: true,
    baja_usuario: true,
    creador: true,
    modificador: true
};

export const UsuarioService = {
    findAll() {
        return prisma.usuario.findMany({
            select:
                seleccionUsuarioSeguro
        });
    },

    findOne(
        id: number
    ) {
        return prisma.usuario.findUnique({
            where: {
                id_usuario:
                    id
            },

            select:
                seleccionUsuarioSeguro
        });
    },

    findByCorreoAndActivo(
        correo: string,
        activo: boolean
    ) {
        return prisma.usuario.findFirst({
            where: {
                correo,
                activo
            }
        });
    },

    async validarIdentidadDisponible(
        idUsuario: number,
        correo: string,
        username: string
    ) {
        const usuarioCorreo =
            await prisma.usuario.findFirst({
                where: {
                    correo:
                        correo.trim(),

                    id_usuario: {
                        not:
                            idUsuario
                    }
                },

                select: {
                    id_usuario:
                        true
                }
            });

        if (usuarioCorreo) {
            throw new Error(
                "CORREO_DUPLICADO"
            );
        }

        const usuarioUsername =
            await prisma.usuario.findFirst({
                where: {
                    username:
                        username.trim(),

                    id_usuario: {
                        not:
                            idUsuario
                    }
                },

                select: {
                    id_usuario:
                        true
                }
            });

        if (usuarioUsername) {
            throw new Error(
                "USERNAME_DUPLICADO"
            );
        }
    },

    async actualizarUsuario(
        idUsuario: number,
        data: UpdateUserDto,
        modificador: number
    ) {
        await this.validarIdentidadDisponible(
            idUsuario,
            data.correo,
            data.username
        );

        return prisma.usuario.update({
            where: {
                id_usuario:
                    idUsuario
            },

            data: {
                nombre:
                    data.nombre.trim(),

                correo:
                    data.correo.trim(),

                username:
                    data.username.trim(),

                direccion:
                    data.direccion?.trim() ||
                    null,

                telefono:
                    data.telefono?.trim() ||
                    "",

                fecha_modificacion:
                    new Date(),

                modificador
            },

            select:
                seleccionUsuarioSeguro
        });
    },

    async resetPassword(
        idUsuario: number,
        passwordCifrado: string,
        modificador: number
    ) {
        return prisma.usuario.update({
            where: {
                id_usuario:
                    idUsuario
            },

            data: {
                password:
                    passwordCifrado,

                reintentos:
                    0,

                bloqueado_hasta:
                    null,

                fecha_modificacion:
                    new Date(),

                modificador
            },

            select:
                seleccionUsuarioSeguro
        });
    },

    async changeUsuarioActivoById(
        id_usuario: number,
        activo: boolean,
        modificador: number,
        motivoBaja?: string | null
    ) {
        return prisma.usuario.update({
            where: {
                id_usuario
            },

            data: {
                activo,

                fecha_modificacion:
                    new Date(),

                modificador,

                fecha_baja:
                    activo
                        ? null
                        : new Date(),

                motivo_baja:
                    activo
                        ? null
                        : motivoBaja?.trim() ||
                          "Baja administrativa",

                baja_usuario:
                    activo
                        ? null
                        : modificador
            },

            select:
                seleccionUsuarioSeguro
        });
    },

    async findAllWithRolesAndApp():
        Promise<UsuarioAdminTable[]> {
        const usuarios =
            await prisma.usuario.findMany({
                select: {
                    id_usuario:
                        true,

                    nombre:
                        true,

                    correo:
                        true,

                    username:
                        true,

                    activo:
                        true,

                    fecha_creacion:
                        true,

                    fecha_modificacion:
                        true,

                    fecha_baja:
                        true,

                    motivo_baja:
                        true,

                    baja_usuario:
                        true,

                    configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario: {
                        where: {
                            activo:
                                true
                        },

                        select: {
                            rol_configuracion_usuario_rol_rolTorol: {
                                select: {
                                    codigo:
                                        true,

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

        return usuarios.map(
            (
                usuario
            ) => {
                const roles =
                    new Set<string>();

                const apps =
                    new Set<string>();

                usuario
                    .configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario
                    .forEach(
                        (
                            configuracion
                        ) => {
                            const rol =
                                configuracion
                                    .rol_configuracion_usuario_rol_rolTorol;

                            roles.add(
                                rol.codigo
                            );

                            apps.add(
                                rol
                                    .aplicacion_rol_aplicacionToaplicacion
                                    .codigo
                            );
                        }
                    );

                return {
                    id_usuario:
                        usuario.id_usuario,

                    nombre:
                        usuario.nombre,

                    correo:
                        usuario.correo,

                    usuario:
                        usuario.username,

                    fechaCreacion:
                        usuario.fecha_creacion
                            ? formatDateTime(
                                usuario.fecha_creacion
                            )
                            : "",

                    fechaModificacion:
                        usuario.fecha_modificacion
                            ? formatDateTime(
                                usuario.fecha_modificacion
                            )
                            : "",

                    fechaBaja:
                        usuario.fecha_baja
                            ? formatDateTime(
                                usuario.fecha_baja
                            )
                            : "",

                    motivoBaja:
                        usuario.motivo_baja ??
                        null,

                    bajaUsuario:
                        usuario.baja_usuario ??
                        null,

                    activo:
                        usuario.activo,

                    roles:
                        Array.from(
                            roles
                        ),

                    apps:
                        Array.from(
                            apps
                        )
                };
            }
        );
    },

    async findByFilters(
        filtros:
            BuscarUsuariosDto
    ): Promise<
        PagedResult<UsuarioAdminTable>
    > {
        const page =
            Math.max(
                1,
                filtros.page ??
                    1
            );

        const pageSize =
            Math.min(
                100,
                Math.max(
                    1,
                    filtros.pageSize ??
                        10
                )
            );

        const skip =
            (
                page -
                1
            ) *
            pageSize;

        const where = {
            ...(
                filtros.nombre && {
                    nombre: {
                        contains:
                            filtros.nombre
                    }
                }
            ),

            ...(
                filtros.usuario && {
                    username: {
                        contains:
                            filtros.usuario
                    }
                }
            ),

            ...(
                filtros.activo !== null &&
                filtros.activo !== undefined && {
                    activo:
                        filtros.activo
                }
            ),

            ...(
                (
                    filtros.creadoDesde ||
                    filtros.creadoHasta
                ) && {
                    fecha_creacion: {
                        ...(
                            filtros.creadoDesde && {
                                gte:
                                    cleanDate(
                                        filtros.creadoDesde,
                                        true
                                    )
                            }
                        ),

                        ...(
                            filtros.creadoHasta && {
                                lte:
                                    cleanDate(
                                        filtros.creadoHasta,
                                        false
                                    )
                            }
                        )
                    }
                }
            ),

            ...(
                (
                    filtros.modDesde ||
                    filtros.modHasta
                ) && {
                    fecha_modificacion: {
                        ...(
                            filtros.modDesde && {
                                gte:
                                    cleanDate(
                                        filtros.modDesde,
                                        true
                                    )
                            }
                        ),

                        ...(
                            filtros.modHasta && {
                                lte:
                                    cleanDate(
                                        filtros.modHasta,
                                        false
                                    )
                            }
                        )
                    }
                }
            ),

            ...(
                (
                    filtros.appsCodes
                        ?.length ||
                    filtros.rolesCodes
                        ?.length
                ) && {
                    configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario: {
                        some: {
                            activo:
                                true,

                            ...(
                                filtros.rolesCodes
                                    ?.length && {
                                    rol_configuracion_usuario_rol_rolTorol: {
                                        codigo: {
                                            in:
                                                filtros.rolesCodes
                                        }
                                    }
                                }
                            ),

                            ...(
                                filtros.appsCodes
                                    ?.length && {
                                    rol_configuracion_usuario_rol_rolTorol: {
                                        aplicacion_rol_aplicacionToaplicacion: {
                                            codigo: {
                                                in:
                                                    filtros.appsCodes
                                            }
                                        }
                                    }
                                }
                            )
                        }
                    }
                }
            )
        };

        const orderBy =
            filtros.orderBy
                ? {
                    [
                        filtros.orderBy
                            .field
                    ]:
                        filtros.orderBy
                            .direction as
                            Prisma.SortOrder
                }
                : {
                    nombre:
                        "asc" as
                        Prisma.SortOrder
                };

        const total =
            await prisma.usuario.count({
                where
            });

        const usuarios =
            await prisma.usuario.findMany({
                where,
                skip,
                take:
                    pageSize,
                orderBy,

                select: {
                    id_usuario:
                        true,

                    nombre:
                        true,

                    correo:
                        true,

                    username:
                        true,

                    activo:
                        true,

                    fecha_creacion:
                        true,

                    fecha_modificacion:
                        true,

                    fecha_baja:
                        true,

                    motivo_baja:
                        true,

                    baja_usuario:
                        true,

                    configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario: {
                        where: {
                            activo:
                                true
                        },

                        select: {
                            rol_configuracion_usuario_rol_rolTorol: {
                                select: {
                                    codigo:
                                        true,

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

        const data:
            UsuarioAdminTable[] =
            usuarios.map(
                (
                    usuario
                ) => {
                    const roles =
                        new Set<string>();

                    const apps =
                        new Set<string>();

                    usuario
                        .configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario
                        .forEach(
                            (
                                configuracion
                            ) => {
                                const rol =
                                    configuracion
                                        .rol_configuracion_usuario_rol_rolTorol;

                                roles.add(
                                    rol.codigo
                                );

                                apps.add(
                                    rol
                                        .aplicacion_rol_aplicacionToaplicacion
                                        .codigo
                                );
                            }
                        );

                    return {
                        id_usuario:
                            usuario.id_usuario,

                        nombre:
                            usuario.nombre,

                        correo:
                            usuario.correo,

                        usuario:
                            usuario.username,

                        fechaCreacion:
                            usuario.fecha_creacion
                                ? formatDateTime(
                                    usuario.fecha_creacion
                                )
                                : "",

                        fechaModificacion:
                            usuario.fecha_modificacion
                                ? formatDateTime(
                                    usuario.fecha_modificacion
                                )
                                : "",

                        fechaBaja:
                            usuario.fecha_baja
                                ? formatDateTime(
                                    usuario.fecha_baja
                                )
                                : "",

                        motivoBaja:
                            usuario.motivo_baja ??
                            null,

                        bajaUsuario:
                            usuario.baja_usuario ??
                            null,

                        activo:
                            usuario.activo,

                        roles:
                            Array.from(
                                roles
                            ),

                        apps:
                            Array.from(
                                apps
                            )
                    };
                }
            );

        return {
            data,
            page,
            pageSize,
            total,

            totalPages:
                Math.ceil(
                    total /
                    pageSize
                )
        };
    },

    async createUsuarioWithRolConfig(
        usuario:
            CreateUserDto,

        roles:
            RolConfigUsuario[],

        id_creador:
            number
    ) {
        return prisma.$transaction(
            async (
                tx
            ) => {
                const usuarioExistente =
                    await tx.usuario.findFirst({
                        where: {
                            OR: [
                                {
                                    correo:
                                        usuario.correo
                                },
                                {
                                    username:
                                        usuario.username
                                }
                            ]
                        },

                        select: {
                            id_usuario:
                                true
                        }
                    });

                if (
                    usuarioExistente
                ) {
                    throw new Error(
                        "Correo o username ya registrados"
                    );
                }

                const nuevoUsuario =
                    await tx.usuario.create({
                        data: {
                            nombre:
                                usuario.nombre.trim(),

                            correo:
                                usuario.correo.trim(),

                            username:
                                usuario.username.trim(),

                            password:
                                usuario.password,

                            direccion:
                                usuario.direccion?.trim() ||
                                null,

                            telefono:
                                usuario.telefono?.trim() ||
                                "",

                            activo:
                                true,

                            fecha_creacion:
                                new Date(),

                            fecha_baja:
                                null,

                            motivo_baja:
                                null,

                            baja_usuario:
                                null,

                            creador:
                                id_creador ||
                                null
                        }
                    });

                await tx
                    .configuracion_usuario_rol
                    .createMany({
                        data:
                            roles.map(
                                (
                                    rol
                                ) => ({
                                    usuario:
                                        nuevoUsuario
                                            .id_usuario,

                                    rol:
                                        rol.id_rol,

                                    activo:
                                        true,

                                    por_defecto:
                                        rol.default
                                })
                            )
                    });

                return {
                    message:
                        "Usuario creado correctamente",

                    usuarioId:
                        nuevoUsuario
                            .id_usuario
                };
            }
        );
    }
};