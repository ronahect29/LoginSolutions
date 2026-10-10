import {
    prisma
} from "../prisma";


export interface AccesoRolInput {
    id_rol: number;
    default: boolean;
}


export interface RolAccesoUsuario {
    id_rol: number;
    nombre: string;
    codigo: string;

    id_aplicacion: number;
    aplicacion_codigo: string;

    default: boolean;
}


function validarEstructuraRoles(
    roles:
        AccesoRolInput[]
) {
    if (
        !Array.isArray(
            roles
        ) ||
        roles.length ===
            0
    ) {
        throw new Error(
            "ACCESOS_SIN_ROLES"
        );
    }


    const ids =
        roles.map(
            (
                rol
            ) =>
                rol.id_rol
        );


    const idsUnicos =
        new Set(
            ids
        );


    if (
        idsUnicos.size !==
        ids.length
    ) {
        throw new Error(
            "ROL_DUPLICADO"
        );
    }


    const cantidadDefault =
        roles.filter(
            (
                rol
            ) =>
                rol.default ===
                true
        ).length;


    if (
        cantidadDefault !==
        1
    ) {
        throw new Error(
            "ROL_PRINCIPAL_INVALIDO"
        );
    }


    for (
        const rol
        of roles
    ) {
        if (
            !Number.isInteger(
                rol.id_rol
            ) ||
            rol.id_rol <=
                0 ||
            typeof rol.default !==
                "boolean"
        ) {
            throw new Error(
                "ROL_INVALIDO"
            );
        }
    }
}


async function obtenerRolesValidos(
    roles:
        AccesoRolInput[]
) {
    const ids =
        roles.map(
            (
                rol
            ) =>
                rol.id_rol
        );


    const rolesDb =
        await prisma.rol
            .findMany({
                where: {
                    id_rol: {
                        in:
                            ids
                    },

                    activo:
                        true,

                    aplicacion_rol_aplicacionToaplicacion: {
                        activo:
                            true
                    }
                },

                select: {
                    id_rol:
                        true,

                    nombre:
                        true,

                    codigo:
                        true,

                    aplicacion_rol_aplicacionToaplicacion: {
                        select: {
                            id_aplicacion:
                                true,

                            codigo:
                                true
                        }
                    }
                }
            });


    if (
        rolesDb.length !==
        ids.length
    ) {
        throw new Error(
            "ROL_NO_DISPONIBLE"
        );
    }


    return rolesDb;
}


async function prepararActualizacionAccesos(
    idUsuario:
        number,

    roles:
        AccesoRolInput[],

    idModificador:
        number
) {
    validarEstructuraRoles(
        roles
    );


    const usuario =
        await prisma.usuario
            .findUnique({
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

                    activo:
                        true
                }
            });


    if (!usuario) {
        throw new Error(
            "USUARIO_NO_ENCONTRADO"
        );
    }


    if (
        usuario.activo !==
        true
    ) {
        throw new Error(
            "USUARIO_INACTIVO"
        );
    }


    const rolesValidos =
        await obtenerRolesValidos(
            roles
        );


    if (
        idUsuario ===
            idModificador &&
        !rolesValidos.some(
            (
                rol
            ) =>
                rol.codigo
                    .trim()
                    .toUpperCase() ===
                "SA-PAW"
        )
    ) {
        throw new Error(
            "AUTO_BLOQUEO_ADMIN"
        );
    }


    const configuracionesActuales =
        await prisma
            .configuracion_usuario_rol
            .findMany({
                where: {
                    usuario:
                        idUsuario,

                    activo:
                        true,

                    rol_configuracion_usuario_rol_rolTorol: {
                        activo:
                            true,

                        aplicacion_rol_aplicacionToaplicacion: {
                            activo:
                                true
                        }
                    }
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
            });


    const teniaAccesoPMW =
        configuracionesActuales
            .some(
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


    const tendraAccesoPMW =
        rolesValidos
            .some(
                (
                    rol
                ) =>
                    rol
                        .aplicacion_rol_aplicacionToaplicacion
                        .codigo
                        .trim()
                        .toUpperCase() ===
                    "PMW"
            );


    return {
        usuario,
        rolesValidos,
        teniaAccesoPMW,
        tendraAccesoPMW
    };
}


export const ConfiguracionUsuarioRolService = {
    findAll() {
        return prisma
            .configuracion_usuario_rol
            .findMany();
    },


    async findRolesByUsuarioIdAndAplicacionCodigo(
        id:
            number,

        codeApp:
            string
    ) {
        const config =
            await prisma
                .configuracion_usuario_rol
                .findMany({
                    where: {
                        activo:
                            true,

                        usuario_configuracion_usuario_rol_usuarioTousuario: {
                            id_usuario:
                                id
                        },

                        rol_configuracion_usuario_rol_rolTorol: {
                            activo:
                                true,

                            aplicacion_rol_aplicacionToaplicacion: {
                                codigo:
                                    codeApp,

                                activo:
                                    true
                            }
                        }
                    },

                    include: {
                        rol_configuracion_usuario_rol_rolTorol:
                            true
                    }
                });


        return config.map(
            (
                configuracion
            ) => ({
                ...configuracion
                    .rol_configuracion_usuario_rol_rolTorol,

                por_defecto:
                    configuracion
                        .por_defecto,

                en_uso:
                    configuracion
                        .por_defecto
            })
        );
    },


    findOne(
        id:
            number
    ) {
        return prisma
            .configuracion_usuario_rol
            .findUnique({
                where: {
                    id_configuracion_usuario_rol:
                        id
                }
            });
    },


    create(
        data:
            any
    ) {
        return prisma
            .configuracion_usuario_rol
            .create({
                data
            });
    },


    async findAccessByUsuarioId(
        idUsuario:
            number
    ) {
        const usuario =
            await prisma.usuario
                .findUnique({
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

                        activo:
                            true
                    }
                });


        if (!usuario) {
            throw new Error(
                "USUARIO_NO_ENCONTRADO"
            );
        }


        const configuraciones =
            await prisma
                .configuracion_usuario_rol
                .findMany({
                    where: {
                        usuario:
                            idUsuario,

                        activo:
                            true,

                        rol_configuracion_usuario_rol_rolTorol: {
                            activo:
                                true,

                            aplicacion_rol_aplicacionToaplicacion: {
                                activo:
                                    true
                            }
                        }
                    },

                    select: {
                        por_defecto:
                            true,

                        rol_configuracion_usuario_rol_rolTorol: {
                            select: {
                                id_rol:
                                    true,

                                nombre:
                                    true,

                                codigo:
                                    true,

                                aplicacion_rol_aplicacionToaplicacion: {
                                    select: {
                                        id_aplicacion:
                                            true,

                                        nombre:
                                            true,

                                        codigo:
                                            true
                                    }
                                }
                            }
                        }
                    },

                    orderBy: {
                        id_configuracion_usuario_rol:
                            "asc"
                    }
                });


        const aplicacionesMap =
            new Map<
                number,
                {
                    id_aplicacion:
                        number;

                    nombre:
                        string;

                    codigo:
                        string;
                }
            >();


        const roles:
            RolAccesoUsuario[] =
            configuraciones.map(
                (
                    configuracion
                ) => {
                    const rol =
                        configuracion
                            .rol_configuracion_usuario_rol_rolTorol;


                    const aplicacion =
                        rol
                            .aplicacion_rol_aplicacionToaplicacion;


                    aplicacionesMap.set(
                        aplicacion.id_aplicacion,
                        {
                            id_aplicacion:
                                aplicacion.id_aplicacion,

                            nombre:
                                aplicacion.nombre,

                            codigo:
                                aplicacion.codigo
                        }
                    );


                    return {
                        id_rol:
                            rol.id_rol,

                        nombre:
                            rol.nombre,

                        codigo:
                            rol.codigo,

                        id_aplicacion:
                            aplicacion.id_aplicacion,

                        aplicacion_codigo:
                            aplicacion.codigo,

                        default:
                            configuracion
                                .por_defecto
                    };
                }
            );


        return {
            usuario,

            aplicaciones:
                Array.from(
                    aplicacionesMap
                        .values()
                ),

            roles,

            tiene_acceso_pmw:
                roles.some(
                    (
                        rol
                    ) =>
                        rol
                            .aplicacion_codigo
                            .trim()
                            .toUpperCase() ===
                        "PMW"
                )
        };
    },


    prepararActualizacion(
        idUsuario:
            number,

        roles:
            AccesoRolInput[],

        idModificador:
            number
    ) {
        return prepararActualizacionAccesos(
            idUsuario,
            roles,
            idModificador
        );
    },


    async actualizarAccesos(
        idUsuario:
            number,

        roles:
            AccesoRolInput[],

        idModificador:
            number
    ) {
        await prepararActualizacionAccesos(
            idUsuario,
            roles,
            idModificador
        );


        const rolesIds =
            roles.map(
                (
                    rol
                ) =>
                    rol.id_rol
            );


        await prisma.$transaction(
            async (
                tx
            ) => {
                const configuracionesExistentes =
                    await tx
                        .configuracion_usuario_rol
                        .findMany({
                            where: {
                                usuario:
                                    idUsuario,

                                rol: {
                                    in:
                                        rolesIds
                                }
                            },

                            orderBy: {
                                id_configuracion_usuario_rol:
                                    "asc"
                            }
                        });


                const primeraConfiguracionPorRol =
                    new Map<
                        number,
                        number
                    >();


                for (
                    const configuracion
                    of configuracionesExistentes
                ) {
                    if (
                        !primeraConfiguracionPorRol
                            .has(
                                configuracion.rol
                            )
                    ) {
                        primeraConfiguracionPorRol
                            .set(
                                configuracion.rol,
                                configuracion
                                    .id_configuracion_usuario_rol
                            );
                    }
                }


                await tx
                    .configuracion_usuario_rol
                    .updateMany({
                        where: {
                            usuario:
                                idUsuario
                        },

                        data: {
                            activo:
                                false,

                            por_defecto:
                                false
                        }
                    });


                for (
                    const rol
                    of roles
                ) {
                    const idConfiguracion =
                        primeraConfiguracionPorRol
                            .get(
                                rol.id_rol
                            );


                    if (
                        idConfiguracion
                    ) {
                        await tx
                            .configuracion_usuario_rol
                            .update({
                                where: {
                                    id_configuracion_usuario_rol:
                                        idConfiguracion
                                },

                                data: {
                                    activo:
                                        true,

                                    por_defecto:
                                        rol.default
                                }
                            });
                    } else {
                        await tx
                            .configuracion_usuario_rol
                            .create({
                                data: {
                                    usuario:
                                        idUsuario,

                                    rol:
                                        rol.id_rol,

                                    activo:
                                        true,

                                    por_defecto:
                                        rol.default
                                }
                            });
                    }
                }


                await tx.usuario
                    .update({
                        where: {
                            id_usuario:
                                idUsuario
                        },

                        data: {
                            fecha_modificacion:
                                new Date(),

                            modificador:
                                idModificador
                        }
                    });
            }
        );


        return this
            .findAccessByUsuarioId(
                idUsuario
            );
    }
};