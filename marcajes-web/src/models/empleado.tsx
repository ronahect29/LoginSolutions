import type { Rol } from "./rol";

/**
 * Empleado autenticado almacenado en la sesión.
 */
export interface AuthEmpleado {
    id_usuario: number;
    id_empleado: number;
    correo: string;
    nombre: string;
    username: string;
    roles: Rol[];
}

/**
 * Información resumida de la sucursal asignada.
 */
export interface SucursalEmpleado {
    id_sucursal: number;
    nombre: string;
    direccion: string;
    activo: boolean | null;
}

/**
 * Información resumida del supervisor asignado.
 */
export interface SupervisorEmpleado {
    id_empleado: number;
    nombre: string;
    correo: string;
    username: string;
}

/**
 * Último marcaje registrado por el empleado.
 *
 * Prisma devuelve los valores Decimal como texto
 * en determinadas configuraciones, por eso latitud
 * y longitud aceptan string o number.
 */
export interface UltimoMarcajeEmpleado {
    id_marcaje: number;
    fecha: string;
    hora: string;
    es_entrada: boolean;
    latitud: string | number | null;
    longitud: string | number | null;
}

/**
 * Estructura devuelta por:
 *
 * GET /empleado/findAll
 * GET /empleado/findBySupervisor/:idSupervisor
 * GET /empleado/findSinSupervisor
 */
export interface EmpleadoEquipo {
    id_empleado: number;
    id_auth: number;
    correo: string;
    nombre: string;
    username: string;
    direccion: string | null;
    telefono: string | null;
    sucursal: number | null;
    jefe: number | null;

    sucursal_empleado_sucursalTosucursal:
        SucursalEmpleado | null;

    empleado:
        SupervisorEmpleado | null;

    marcaje_marcaje_empleadoToempleado:
        UltimoMarcajeEmpleado[];
}

/**
 * Datos editables desde la pantalla Equipo.
 *
 * El nombre, correo y username continúan siendo
 * administrados desde el servicio de usuarios.
 */
export interface ActualizarEmpleadoOperativoDto {
    direccion: string | null;
    telefono: string | null;
    sucursal: number | null;
    jefe: number | null;
}

/**
 * Respuesta del endpoint de actualización operativa.
 */
export interface RespuestaActualizacionEmpleado {
    message: string;
    empleado: EmpleadoEquipo;
}

/**
 * Estado utilizado por el formulario visual.
 */
export interface FormularioEmpleadoEquipo {
    direccion: string;
    telefono: string;
    sucursal: string;
    jefe: string;
}