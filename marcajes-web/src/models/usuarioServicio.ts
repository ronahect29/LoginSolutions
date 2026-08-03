/**
 * Usuario devuelto por:
 *
 * GET /user-service/api/usuarios/findAllWithRolesAndApps
 */
export interface UsuarioServicio {
    id_usuario: number;
    nombre: string;
    correo: string;
    usuario: string;
    fechaCreacion: string;
    fechaModificacion: string;
    activo: boolean;
    roles: string[];
    apps: string[];
}

/**
 * Relación entre el empleado operativo de marcajes
 * y los datos de seguridad administrados por user-service.
 */
export interface ClasificacionEmpleado {
    id_auth: number;
    activo: boolean;
    esMotorista: boolean;
    esSupervisor: boolean;
    roles: string[];
}