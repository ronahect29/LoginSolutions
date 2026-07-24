import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roles: string[];
}

export interface UpsertUserDto {
  name: string;
  email: string;
  password: string;
  username: string;
  telefono: string;
}

export interface AssignRoleDto {
  roleId: number;
}

export async function getUsers(): Promise<User[]> {
  const res = await api.get("/users");
  return res.data;
}

export async function createUser(data: UpsertUserDto): Promise<User> {
  const res = await api.post("/auth/register", {
    email: data.email,
    password: data.password,
    nombre: data.name,
    username: data.username,
    telefono: data.telefono,
  });
  return res.data;
}

export async function updateUser(id: number, data: UpsertUserDto): Promise<User> {
  const res = await api.put(`/admin/users/${id}`, data);
  return res.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}