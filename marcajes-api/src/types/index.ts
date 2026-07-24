export interface JwtPayload{
    id_usuario: number;
    correo: string;
    app: string;
    roles: string[]
}