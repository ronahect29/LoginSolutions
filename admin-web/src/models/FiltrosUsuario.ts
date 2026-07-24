import type { FiltroAplicacion } from "./FiltroAplicacion";
import type { FiltroRol } from "./FiltroRol";

export type UserActivoFilter = boolean | null;

export interface FiltroUsuario {
    nombre: string;
    usuario: string;
    activo: UserActivoFilter;

    creadoDesde: string;  // ISO yyyy-mm-dd
    creadoHasta: string;
    modDesde: string;
    modHasta: string;

    aplicaciones: FiltroAplicacion[]; // ids o códigos
    roles: FiltroRol[];        // ids o códigos
}
