import { Rol } from "./rol";

export interface UserServiceLoginResponse{
    accessToken: string;
    empleado: {
        id_usuario: number;
        correo: string;
        nombre: string;
        username: string;
        activo: boolean;
        roles: Rol[]
    }
}
