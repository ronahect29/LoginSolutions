import { api } from "./api";

export interface AppEntity {
  id: number;
  name: string;
  activo: boolean;
  description?: string;
}

export interface UpsertAppDto {
  name: string;
  activo: boolean;
  description?: string;
}

export async function getApps(): Promise<AppEntity[]> {
  const res = await api.get("/admin/apps");
  return res.data;
}

export async function createApp(data: UpsertAppDto): Promise<AppEntity> {
  const res = await api.post("/admin/apps", data);
  return res.data;
}

export async function updateApp(id: number, data: UpsertAppDto): Promise<AppEntity> {
  const res = await api.put(`/admin/apps/${id}`, data);
  return res.data;
}

export async function deleteApp(id: number): Promise<void> {
  await api.delete(`/admin/apps/${id}`);
}
