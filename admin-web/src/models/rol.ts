export interface Rol {
    id_rol: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    activo: boolean;
    en_uso: boolean;
    por_defecto: boolean;
    aplicacion?: string
}
