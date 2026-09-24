import { type RolFiltroDto } from "../models/Rol";
import { prisma } from "../prisma";

// ======================================================
// TIPOS
// ======================================================

export interface RolAdminInput {
    nombre: string;
    codigo: string;
    descripcion: string;
    activo: boolean;
    id_aplicacion: number;
}

export interface RolAdminDto {
    id_rol: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    activo: boolean;
    aplicacion: {
        id_aplicacion: number;
        nombre: string;
        codigo: string;
        activo: boolean;
    };
}

// ======================================================
// HELPERS
// ======================================================

function normalizarCodigo(codigo: string): string {
    return codigo
        .trim()
        .toUpperCase();
}

function normalizarTexto(texto: string): string {
    return texto.trim();
}

function mapRolAdmin(row: {
    id_rol: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    activo: boolean;
    aplicacion_rol_aplicacionToaplicacion: {
        id_aplicacion: number;
        nombre: string;
        codigo: string;
        activo: boolean;
    };
}): RolAdminDto {
    return {
        id_rol: row.id_rol,
        nombre: row.nombre,
        codigo: row.codigo,
        descripcion: row.descripcion,
        activo: row.activo,
        aplicacion: {
            id_aplicacion:
                row.aplicacion_rol_aplicacionToaplicacion
                    .id_aplicacion,

            nombre:
                row.aplicacion_rol_aplicacionToaplicacion
                    .nombre,

            codigo:
                row.aplicacion_rol_aplicacionToaplicacion
                    .codigo,

            activo:
                row.aplicacion_rol_aplicacionToaplicacion
                    .activo,
        },
    };
}

async function obtenerRolAdmin(
    idRol: number
): Promise<RolAdminDto | null> {
    const row =
        await prisma.rol.findUnique({
            where: {
                id_rol: idRol,
            },
            select: {
                id_rol: true,
                nombre: true,
                codigo: true,
                descripcion: true,
                activo: true,

                aplicacion_rol_aplicacionToaplicacion: {
                    select: {
                        id_aplicacion: true,
                        nombre: true,
                        codigo: true,
                        activo: true,
                    },
                },
            },
        });

    if (!row) {
        return null;
    }

    return mapRolAdmin(row);
}

// ======================================================
// SERVICIO
// ======================================================

export const RolService = {
    // ======================================================
    // CONSULTAS UTILIZADAS POR ASIGNACIÓN DE USUARIOS
    // ======================================================

    async findRolesByActivoAndApp(
        activo: boolean,
        id_app: number
    ): Promise<RolFiltroDto[]> {
        const data =
            await prisma.rol.findMany({
                where: {
                    activo,

                    aplicacion_rol_aplicacionToaplicacion: {
                        id_aplicacion: id_app,
                    },
                },

                select: {
                    id_rol: true,
                    nombre: true,
                    codigo: true,
                },
            });

        return data;
    },

    async findRolesByActivoAndCodigosAplicacionActivo(
        activo: boolean,
        appsCodes: string[]
    ): Promise<RolFiltroDto[]> {
        const data =
            await prisma.rol.findMany({
                where: {
                    activo,

                    aplicacion_rol_aplicacionToaplicacion: {
                        codigo: {
                            in: appsCodes,
                        },

                        activo: true,
                    },
                },

                select: {
                    id_rol: true,
                    nombre: true,
                    codigo: true,
                },
            });

        return data;
    },

    // ======================================================
    // ADMINISTRACIÓN DE ROLES
    // ======================================================

    async findAllAdmin(): Promise<RolAdminDto[]> {
        const rows =
            await prisma.rol.findMany({
                select: {
                    id_rol: true,
                    nombre: true,
                    codigo: true,
                    descripcion: true,
                    activo: true,

                    aplicacion_rol_aplicacionToaplicacion: {
                        select: {
                            id_aplicacion: true,
                            nombre: true,
                            codigo: true,
                            activo: true,
                        },
                    },
                },

                orderBy: [
                    {
                        nombre: "asc",
                    },
                    {
                        codigo: "asc",
                    },
                ],
            });

        return rows.map(
            mapRolAdmin
        );
    },

    async createAdmin(
        input: RolAdminInput
    ): Promise<RolAdminDto> {
        const codigo =
            normalizarCodigo(
                input.codigo
            );

        const nombre =
            normalizarTexto(
                input.nombre
            );

        const descripcion =
            normalizarTexto(
                input.descripcion
            );

        const aplicacion =
            await prisma.aplicacion.findUnique({
                where: {
                    id_aplicacion:
                        input.id_aplicacion,
                },
            });

        if (!aplicacion) {
            throw new Error(
                "APLICACION_NO_ENCONTRADA"
            );
        }

        const duplicado =
            await prisma.rol.findFirst({
                where: {
                    codigo,
                },
            });

        if (duplicado) {
            throw new Error(
                "CODIGO_ROL_DUPLICADO"
            );
        }

        const nuevoRol =
            await prisma.rol.create({
                data: {
                    nombre,
                    codigo,
                    descripcion,
                    activo:
                        input.activo,
                    aplicacion:
                        input.id_aplicacion,
                },
            });

        const creado =
            await obtenerRolAdmin(
                nuevoRol.id_rol
            );

        if (!creado) {
            throw new Error(
                "ROL_NO_ENCONTRADO"
            );
        }

        return creado;
    },

    async updateAdmin(
        idRol: number,
        input: RolAdminInput
    ): Promise<RolAdminDto> {
        const existente =
            await prisma.rol.findUnique({
                where: {
                    id_rol: idRol,
                },
            });

        if (!existente) {
            throw new Error(
                "ROL_NO_ENCONTRADO"
            );
        }

        const aplicacion =
            await prisma.aplicacion.findUnique({
                where: {
                    id_aplicacion:
                        input.id_aplicacion,
                },
            });

        if (!aplicacion) {
            throw new Error(
                "APLICACION_NO_ENCONTRADA"
            );
        }

        const codigo =
            normalizarCodigo(
                input.codigo
            );

        const duplicado =
            await prisma.rol.findFirst({
                where: {
                    codigo,

                    id_rol: {
                        not: idRol,
                    },
                },
            });

        if (duplicado) {
            throw new Error(
                "CODIGO_ROL_DUPLICADO"
            );
        }

        await prisma.rol.update({
            where: {
                id_rol: idRol,
            },

            data: {
                nombre:
                    normalizarTexto(
                        input.nombre
                    ),

                codigo,

                descripcion:
                    normalizarTexto(
                        input.descripcion
                    ),

                activo:
                    input.activo,

                aplicacion:
                    input.id_aplicacion,
            },
        });

        const actualizado =
            await obtenerRolAdmin(
                idRol
            );

        if (!actualizado) {
            throw new Error(
                "ROL_NO_ENCONTRADO"
            );
        }

        return actualizado;
    },

    async changeActivoAdmin(
        idRol: number,
        activo: boolean
    ): Promise<RolAdminDto> {
        const existente =
            await prisma.rol.findUnique({
                where: {
                    id_rol: idRol,
                },
            });

        if (!existente) {
            throw new Error(
                "ROL_NO_ENCONTRADO"
            );
        }

        await prisma.rol.update({
            where: {
                id_rol: idRol,
            },

            data: {
                activo,
            },
        });

        const actualizado =
            await obtenerRolAdmin(
                idRol
            );

        if (!actualizado) {
            throw new Error(
                "ROL_NO_ENCONTRADO"
            );
        }

        return actualizado;
    },
};