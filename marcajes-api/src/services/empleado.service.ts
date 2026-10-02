import { prisma } from "../prisma";

export interface CrearEmpleadoDto {
    id_auth: number;
    correo: string;
    nombre: string;
    username: string;
    direccion?: string | null;
    telefono?: string | null;
    sucursal?: number | null;
    jefe?: number | null;
}

export interface ActualizarEmpleadoOperativoDto {
    direccion?: string | null;
    telefono?: string | null;
    sucursal?: number | null;
    jefe?: number | null;
}

export interface ActualizarIdentidadEmpleadoDto {
    correo: string;
    nombre: string;
    username: string;
    direccion?: string | null;
    telefono?: string | null;
}

const seleccionEmpleadoEquipo = {
    id_empleado: true,
    id_auth: true,
    correo: true,
    nombre: true,
    username: true,
    direccion: true,
    telefono: true,
    sucursal: true,
    jefe: true,
    activo: true,
    fecha_baja: true,
    motivo_baja: true,

    sucursal_empleado_sucursalTosucursal: {
        select: {
            id_sucursal: true,
            nombre: true,
            direccion: true,
            activo: true
        }
    },

    empleado: {
        select: {
            id_empleado: true,
            nombre: true,
            correo: true,
            username: true,
            activo: true
        }
    },

    marcaje_marcaje_empleadoToempleado: {
        select: {
            id_marcaje: true,
            fecha: true,
            hora: true,
            es_entrada: true,
            latitud: true,
            longitud: true
        },
        orderBy: [
            {
                fecha: "desc" as const
            },
            {
                hora: "desc" as const
            }
        ],
        take: 1
    }
};

export const EmpleadoService = {
    findAll() {
        return prisma.empleado.findMany({
            where: {
                activo: true
            },
            select: seleccionEmpleadoEquipo,
            orderBy: {
                nombre: "asc"
            }
        });
    },

    findEquipoPorSupervisor(
        idSupervisor: number
    ) {
        return prisma.empleado.findMany({
            where: {
                jefe: idSupervisor,
                activo: true
            },
            select: seleccionEmpleadoEquipo,
            orderBy: {
                nombre: "asc"
            }
        });
    },

    findSinSupervisor() {
        return prisma.empleado.findMany({
            where: {
                jefe: null,
                activo: true
            },
            select: seleccionEmpleadoEquipo,
            orderBy: {
                nombre: "asc"
            }
        });
    },

    findOne(
        id: number
    ) {
        return prisma.empleado.findUnique({
            where: {
                id_empleado: id
            },
            select: seleccionEmpleadoEquipo
        });
    },

    findByCorreoAndIdAuth(
        correo: string,
        id_auth: number
    ) {
        return prisma.empleado.findMany({
            where: {
                id_auth,
                correo,
                activo: true
            }
        });
    },

    findByCorreo(
        correo: string
    ) {
        return prisma.empleado.findFirst({
            where: {
                correo
            }
        });
    },

    async create(
        data: CrearEmpleadoDto
    ) {
        const empleadoExistente =
            await prisma.empleado.findFirst({
                where: {
                    OR: [
                        {
                            id_auth: data.id_auth
                        },
                        {
                            correo: data.correo
                        }
                    ]
                }
            });

        if (empleadoExistente) {
            return empleadoExistente;
        }

        if (
            data.sucursal !== null &&
            data.sucursal !== undefined
        ) {
            const sucursal =
                await prisma.sucursal.findUnique({
                    where: {
                        id_sucursal: data.sucursal
                    }
                });

            if (!sucursal) {
                throw new Error(
                    "La sucursal seleccionada no existe."
                );
            }

            if (sucursal.activo !== true) {
                throw new Error(
                    "La sucursal seleccionada está inactiva."
                );
            }
        }

        if (
            data.jefe !== null &&
            data.jefe !== undefined
        ) {
            const supervisor =
                await prisma.empleado.findUnique({
                    where: {
                        id_empleado: data.jefe
                    }
                });

            if (!supervisor) {
                throw new Error(
                    "El supervisor seleccionado no existe."
                );
            }

            if (supervisor.activo !== true) {
                throw new Error(
                    "El supervisor seleccionado está inactivo."
                );
            }
        }

        return prisma.empleado.create({
            data: {
                id_auth: data.id_auth,
                correo: data.correo.trim(),
                nombre: data.nombre.trim(),
                username: data.username.trim(),
                direccion:
                    data.direccion?.trim() ||
                    null,
                telefono:
                    data.telefono?.trim() ||
                    null,
                sucursal:
                    data.sucursal ??
                    null,
                jefe:
                    data.jefe ??
                    null,
                activo: true,
                fecha_baja: null,
                motivo_baja: null
            }
        });
    },

    async actualizarDatosOperativos(
        idEmpleado: number,
        data: ActualizarEmpleadoOperativoDto
    ) {
        const empleadoExistente =
            await prisma.empleado.findUnique({
                where: {
                    id_empleado: idEmpleado
                }
            });

        if (!empleadoExistente) {
            throw new Error(
                "El empleado no existe."
            );
        }

        if (
            empleadoExistente.activo !== true
        ) {
            throw new Error(
                "El empleado se encuentra inactivo."
            );
        }

        if (
            data.sucursal !== undefined &&
            data.sucursal !== null
        ) {
            const sucursal =
                await prisma.sucursal.findUnique({
                    where: {
                        id_sucursal:
                            data.sucursal
                    }
                });

            if (!sucursal) {
                throw new Error(
                    "La sucursal seleccionada no existe."
                );
            }

            if (sucursal.activo !== true) {
                throw new Error(
                    "La sucursal seleccionada está inactiva."
                );
            }
        }

        if (
            data.jefe !== undefined &&
            data.jefe !== null
        ) {
            if (
                data.jefe ===
                idEmpleado
            ) {
                throw new Error(
                    "Un empleado no puede asignarse como su propio supervisor."
                );
            }

            const supervisor =
                await prisma.empleado.findUnique({
                    where: {
                        id_empleado:
                            data.jefe
                    }
                });

            if (!supervisor) {
                throw new Error(
                    "El supervisor seleccionado no existe."
                );
            }

            if (supervisor.activo !== true) {
                throw new Error(
                    "El supervisor seleccionado está inactivo."
                );
            }
        }

        await prisma.empleado.update({
            where: {
                id_empleado:
                    idEmpleado
            },
            data: {
                direccion:
                    data.direccion !== undefined
                        ? data.direccion?.trim() ||
                          null
                        : undefined,

                telefono:
                    data.telefono !== undefined
                        ? data.telefono?.trim() ||
                          null
                        : undefined,

                sucursal:
                    data.sucursal !== undefined
                        ? data.sucursal
                        : undefined,

                jefe:
                    data.jefe !== undefined
                        ? data.jefe
                        : undefined
            }
        });

        return prisma.empleado.findUnique({
            where: {
                id_empleado:
                    idEmpleado
            },
            select:
                seleccionEmpleadoEquipo
        });
    },

    async cambiarEstadoPorIdAuth(
        idAuth: number,
        activo: boolean,
        motivoBaja?: string | null
    ) {
        const empleado =
            await prisma.empleado.findFirst({
                where: {
                    id_auth:
                        idAuth
                }
            });

        if (!empleado) {
            return null;
        }

        return prisma.empleado.update({
            where: {
                id_empleado:
                    empleado.id_empleado
            },

            data: {
                activo,

                fecha_baja:
                    activo
                        ? null
                        : new Date(),

                motivo_baja:
                    activo
                        ? null
                        : motivoBaja?.trim() ||
                          "Baja administrativa"
            }
        });
    },

    async actualizarIdentidadPorIdAuth(
        idAuth: number,
        data: ActualizarIdentidadEmpleadoDto
    ) {
        const empleado =
            await prisma.empleado.findFirst({
                where: {
                    id_auth:
                        idAuth
                }
            });

        if (!empleado) {
            return null;
        }

        const correoDuplicado =
            await prisma.empleado.findFirst({
                where: {
                    correo:
                        data.correo.trim(),

                    id_empleado: {
                        not:
                            empleado.id_empleado
                    }
                },

                select: {
                    id_empleado:
                        true
                }
            });

        if (correoDuplicado) {
            throw new Error(
                "El correo ya se encuentra registrado en Marcajes."
            );
        }

        const usernameDuplicado =
            await prisma.empleado.findFirst({
                where: {
                    username:
                        data.username.trim(),

                    id_empleado: {
                        not:
                            empleado.id_empleado
                    }
                },

                select: {
                    id_empleado:
                        true
                }
            });

        if (usernameDuplicado) {
            throw new Error(
                "El nombre de usuario ya se encuentra registrado en Marcajes."
            );
        }

        return prisma.empleado.update({
            where: {
                id_empleado:
                    empleado.id_empleado
            },

            data: {
                correo:
                    data.correo.trim(),

                nombre:
                    data.nombre.trim(),

                username:
                    data.username.trim(),

                direccion:
                    data.direccion !== undefined
                        ? data.direccion?.trim() ||
                          null
                        : undefined,

                telefono:
                    data.telefono !== undefined
                        ? data.telefono?.trim() ||
                          null
                        : undefined
            },

            select:
                seleccionEmpleadoEquipo
        });
    }
};