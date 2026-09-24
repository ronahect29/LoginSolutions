import {
    prisma,
} from "../prisma";

// ======================================================
// TIPOS
// ======================================================

export interface AplicacionAdminInput {
    nombre: string;
    codigo: string;
    descripcion: string;
    activo: boolean;
}

export interface AplicacionAdminDto {
    id_aplicacion: number;
    nombre: string;
    codigo: string;
    descripcion: string | null;
    activo: boolean;
}

// ======================================================
// HELPERS
// ======================================================

function normalizarCodigo(
    codigo: string
): string {
    return codigo
        .trim()
        .toUpperCase();
}

function normalizarTexto(
    texto: string
): string {
    return texto.trim();
}

// ======================================================
// CONSULTAS
// ======================================================

export async function getApps():
    Promise<AplicacionAdminDto[]> {
    return prisma.aplicacion.findMany({
        select: {
            id_aplicacion: true,
            nombre: true,
            codigo: true,
            descripcion: true,
            activo: true,
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
}

// ======================================================
// CREACIÓN
// ======================================================

export async function createApp(
    input: AplicacionAdminInput
): Promise<AplicacionAdminDto> {
    const codigo =
        normalizarCodigo(
            input.codigo
        );

    const duplicada =
        await prisma.aplicacion.findFirst({
            where: {
                codigo,
            },
        });

    if (duplicada) {
        throw new Error(
            "CODIGO_APLICACION_DUPLICADO"
        );
    }

    return prisma.aplicacion.create({
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
        },

        select: {
            id_aplicacion: true,
            nombre: true,
            codigo: true,
            descripcion: true,
            activo: true,
        },
    });
}

// ======================================================
// ACTUALIZACIÓN
// ======================================================

export async function updateApp(
    idAplicacion: number,
    input: AplicacionAdminInput
): Promise<AplicacionAdminDto> {
    const existente =
        await prisma.aplicacion.findUnique({
            where: {
                id_aplicacion:
                    idAplicacion,
            },
        });

    if (!existente) {
        throw new Error(
            "APLICACION_NO_ENCONTRADA"
        );
    }

    const codigo =
        normalizarCodigo(
            input.codigo
        );

    const duplicada =
        await prisma.aplicacion.findFirst({
            where: {
                codigo,

                id_aplicacion: {
                    not:
                        idAplicacion,
                },
            },
        });

    if (duplicada) {
        throw new Error(
            "CODIGO_APLICACION_DUPLICADO"
        );
    }

    return prisma.aplicacion.update({
        where: {
            id_aplicacion:
                idAplicacion,
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
        },

        select: {
            id_aplicacion: true,
            nombre: true,
            codigo: true,
            descripcion: true,
            activo: true,
        },
    });
}

// ======================================================
// CAMBIO DE ESTADO
// ======================================================

export async function changeAppActivo(
    idAplicacion: number,
    activo: boolean
): Promise<AplicacionAdminDto> {
    const existente =
        await prisma.aplicacion.findUnique({
            where: {
                id_aplicacion:
                    idAplicacion,
            },
        });

    if (!existente) {
        throw new Error(
            "APLICACION_NO_ENCONTRADA"
        );
    }

    return prisma.aplicacion.update({
        where: {
            id_aplicacion:
                idAplicacion,
        },

        data: {
            activo,
        },

        select: {
            id_aplicacion: true,
            nombre: true,
            codigo: true,
            descripcion: true,
            activo: true,
        },
    });
}