import { prisma } from "../prisma";
import type {
    ActualizarSucursalDto,
    CrearSucursalDto
} from "../models/sucursal";

export const SucursalService = {
    /**
     * Obtiene todas las sucursales.
     */
    findAll() {
        return prisma.sucursal.findMany({
            orderBy: {
                nombre: "asc"
            }
        });
    },

    /**
     * Obtiene una sucursal por su identificador.
     */
    findOne(id_sucursal: number) {
        return prisma.sucursal.findUnique({
            where: {
                id_sucursal
            }
        });
    },

    /**
     * Obtiene las sucursales según su estado.
     *
     * Este método mantiene solo id y nombre para no afectar
     * el selector que ya utiliza el frontend.
     */
    findByActivo(activo: boolean) {
        return prisma.sucursal.findMany({
            where: {
                activo
            },
            select: {
                id_sucursal: true,
                nombre: true
            },
            orderBy: {
                nombre: "asc"
            }
        });
    },

    /**
     * Verifica si existe otra sucursal con el mismo nombre.
     */
    findByNombre(nombre: string) {
        return prisma.sucursal.findFirst({
            where: {
                nombre: nombre.trim()
            }
        });
    },

    /**
     * Crea una nueva sucursal.
     */
    async create(data: CrearSucursalDto) {
        const nombre = data.nombre.trim();
        const direccion = data.direccion.trim();

        const sucursalExistente = await prisma.sucursal.findFirst({
            where: {
                nombre
            }
        });

        if (sucursalExistente) {
            throw new Error(
                "Ya existe una sucursal registrada con ese nombre."
            );
        }

        return prisma.sucursal.create({
            data: {
                nombre,
                telefono: data.telefono?.trim() || null,
                direccion,
                latitud: data.latitud ?? null,
                longitud: data.longitud ?? null,
                radio_marcaje_metros:
                    data.radio_marcaje_metros ?? 150,
                activo: data.activo ?? true,
                creador: data.creador.trim()
            }
        });
    },

    /**
     * Actualiza los datos de una sucursal.
     */
    async update(
        id_sucursal: number,
        data: ActualizarSucursalDto
    ) {
        const sucursalExistente =
            await prisma.sucursal.findUnique({
                where: {
                    id_sucursal
                }
            });

        if (!sucursalExistente) {
            throw new Error("La sucursal no existe.");
        }

        if (data.nombre !== undefined) {
            const nombre = data.nombre.trim();

            const nombreDuplicado =
                await prisma.sucursal.findFirst({
                    where: {
                        nombre,
                        NOT: {
                            id_sucursal
                        }
                    }
                });

            if (nombreDuplicado) {
                throw new Error(
                    "Ya existe otra sucursal con ese nombre."
                );
            }
        }

        return prisma.sucursal.update({
            where: {
                id_sucursal
            },
            data: {
                nombre:
                    data.nombre !== undefined
                        ? data.nombre.trim()
                        : undefined,

                telefono:
                    data.telefono !== undefined
                        ? data.telefono?.trim() || null
                        : undefined,

                direccion:
                    data.direccion !== undefined
                        ? data.direccion.trim()
                        : undefined,

                latitud:
                    data.latitud !== undefined
                        ? data.latitud
                        : undefined,

                longitud:
                    data.longitud !== undefined
                        ? data.longitud
                        : undefined,

                radio_marcaje_metros:
                    data.radio_marcaje_metros,

                activo: data.activo,

                fecha_modificacion: new Date(),
                modificador: data.modificador.trim()
            }
        });
    },

    /**
     * Activa o desactiva una sucursal sin eliminar
     * sus relaciones ni su historial.
     */
    async cambiarEstado(
        id_sucursal: number,
        activo: boolean,
        modificador: string
    ) {
        const sucursalExistente =
            await prisma.sucursal.findUnique({
                where: {
                    id_sucursal
                }
            });

        if (!sucursalExistente) {
            throw new Error("La sucursal no existe.");
        }

        return prisma.sucursal.update({
            where: {
                id_sucursal
            },
            data: {
                activo,
                fecha_modificacion: new Date(),
                modificador: modificador.trim()
            }
        });
    }
};