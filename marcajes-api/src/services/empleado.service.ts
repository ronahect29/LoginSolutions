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
            username: true
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
    /**
     * Obtiene todos los empleados con información operativa.
     */
    findAll() {
        return prisma.empleado.findMany({
            select: seleccionEmpleadoEquipo,
            orderBy: {
                nombre: "asc"
            }
        });
    },

    /**
     * Obtiene los motoristas asignados directamente
     * a un supervisor.
     */
    findEquipoPorSupervisor(idSupervisor: number) {
        return prisma.empleado.findMany({
            where: {
                jefe: idSupervisor
            },
            select: seleccionEmpleadoEquipo,
            orderBy: {
                nombre: "asc"
            }
        });
    },

    /**
     * Obtiene empleados que todavía no tienen
     * un supervisor asignado.
     */
    findSinSupervisor() {
        return prisma.empleado.findMany({
            where: {
                jefe: null
            },
            select: seleccionEmpleadoEquipo,
            orderBy: {
                nombre: "asc"
            }
        });
    },

    /**
     * Obtiene un empleado por su identificador.
     */
    findOne(id: number) {
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
                correo
            }
        });
    },

    findByCorreo(correo: string) {
        return prisma.empleado.findFirst({
            where: {
                correo
            }
        });
    },

    /**
     * Crea el registro operativo del empleado.
     *
     * Este método continúa siendo idempotente para
     * la integración con user-service.
     */
    async create(data: CrearEmpleadoDto) {
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

        if (data.sucursal !== null &&
            data.sucursal !== undefined) {
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
        }

        if (data.jefe !== null &&
            data.jefe !== undefined) {
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
        }

        return prisma.empleado.create({
            data: {
                id_auth: data.id_auth,
                correo: data.correo.trim(),
                nombre: data.nombre.trim(),
                username: data.username.trim(),

                direccion:
                    data.direccion?.trim() || null,

                telefono:
                    data.telefono?.trim() || null,

                sucursal:
                    data.sucursal ?? null,

                jefe:
                    data.jefe ?? null
            }
        });
    },

    /**
     * Actualiza únicamente la información operativa
     * del empleado.
     *
     * Nombre, correo y username continúan siendo
     * administrados por user-service.
     */
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
            data.sucursal !== undefined &&
            data.sucursal !== null
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
            data.jefe !== undefined &&
            data.jefe !== null
        ) {
            if (data.jefe === idEmpleado) {
                throw new Error(
                    "Un empleado no puede asignarse como su propio supervisor."
                );
            }

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
        }

        await prisma.empleado.update({
            where: {
                id_empleado: idEmpleado
            },
            data: {
                direccion:
                    data.direccion !== undefined
                        ? data.direccion?.trim() || null
                        : undefined,

                telefono:
                    data.telefono !== undefined
                        ? data.telefono?.trim() || null
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
                id_empleado: idEmpleado
            },
            select: seleccionEmpleadoEquipo
        });
    }
};