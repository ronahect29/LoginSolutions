import {
    api,
} from "./api";

// ======================================================
// TIPOS
// ======================================================

export interface RoleApplication {
    id_aplicacion: number;
    nombre: string;
    codigo: string;
    activo: boolean;
}

export interface Role {
    id_rol: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    activo: boolean;
    aplicacion:
        RoleApplication;
}

export interface UpsertRoleDto {
    nombre: string;
    codigo: string;
    descripcion: string;
    activo: boolean;
    id_aplicacion: number;
}

// ======================================================
// CONSULTAS
// ======================================================

export async function getRoles(): Promise<
    Role[]
> {
    const res =
        await api.get<Role[]>(
            "/rol/admin"
        );

    return res.data;
}

// ======================================================
// CREACIÓN
// ======================================================

export async function createRole(
    data: UpsertRoleDto
): Promise<Role> {
    const res =
        await api.post<Role>(
            "/rol/admin",
            data
        );

    return res.data;
}

// ======================================================
// ACTUALIZACIÓN
// ======================================================

export async function updateRole(
    id: number,
    data: UpsertRoleDto
): Promise<Role> {
    const res =
        await api.put<Role>(
            `/rol/admin/${id}`,
            data
        );

    return res.data;
}

// ======================================================
// CAMBIO DE ESTADO
// ======================================================

export async function changeRoleActivo(
    id: number,
    activo: boolean
): Promise<Role> {
    const res =
        await api.patch<Role>(
            `/rol/admin/${id}/activo`,
            {
                activo,
            }
        );

    return res.data;
}