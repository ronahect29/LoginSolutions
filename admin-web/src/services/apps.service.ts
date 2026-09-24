import {
    api,
} from "./api";

// ======================================================
// TIPOS
// ======================================================

export interface AppEntity {
    id_aplicacion: number;
    nombre: string;
    codigo: string;
    activo: boolean;
    descripcion: string | null;
}

export interface UpsertAppDto {
    nombre: string;
    codigo: string;
    activo: boolean;
    descripcion: string;
}

// ======================================================
// CONSULTAS
// ======================================================

export async function getApps():
    Promise<AppEntity[]> {
    const res =
        await api.get<AppEntity[]>(
            "/apps"
        );

    return res.data;
}

// ======================================================
// CREACIÓN
// ======================================================

export async function createApp(
    data: UpsertAppDto
): Promise<AppEntity> {
    const res =
        await api.post<AppEntity>(
            "/apps",
            data
        );

    return res.data;
}

// ======================================================
// ACTUALIZACIÓN
// ======================================================

export async function updateApp(
    id: number,
    data: UpsertAppDto
): Promise<AppEntity> {
    const res =
        await api.put<AppEntity>(
            `/apps/${id}`,
            data
        );

    return res.data;
}

// ======================================================
// CAMBIO DE ESTADO
// ======================================================

export async function changeAppActivo(
    id: number,
    activo: boolean
): Promise<AppEntity> {
    const res =
        await api.patch<AppEntity>(
            `/apps/${id}/activo`,
            {
                activo,
            }
        );

    return res.data;
}