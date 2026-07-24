import { api } from "./api";
import type { AppEntity } from "./apps.service";

export interface Role {
    id: number;
    name: string;
    activo: boolean;
    aplicacion: AppEntity;
    description?: string;
}

export interface UpsertRoleDto {
    name: string;
    activo: boolean;
    aplicacionId: number;
    description?: string;
}

export async function getRoles(): Promise<Role[]> {
    const res = await api.get("/admin/roles");
    return res.data;
}

export async function createRole(data: UpsertRoleDto): Promise<Role> {
    const res = await api.post("/admin/roles", data);
    return res.data;
}

export async function updateRole(id: number, data: UpsertRoleDto): Promise<Role> {
    const res = await api.put(`/admin/roles/${id}`, data);
    return res.data;
}

export async function deleteRole(id: number): Promise<void> {
    await api.delete(`/admin/roles/${id}`);
}
