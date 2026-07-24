import type { Rol } from "./rol";

export interface AuthEmpleado {
    id_usuario: number;
    id_empleado: number;
    correo: string;
    nombre: string;
    username: string;
    roles: Rol[];
}