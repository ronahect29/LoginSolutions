export interface CrearEmpleadoMarcajesDto {
    id_auth: number;
    correo: string;
    nombre: string;
    username: string;
    direccion?: string | null;
    telefono?: string | null;
}

export interface ActualizarEmpleadoMarcajesDto {
    correo: string;
    nombre: string;
    username: string;
    direccion?: string | null;
    telefono?: string | null;
}

export interface CambiarEstadoEmpleadoMarcajesDto {
    activo: boolean;
    motivo_baja?: string | null;
}

interface EmpleadoMarcajesRespuesta {
    id_empleado: number;
    id_auth: number;
    correo: string;
    nombre: string;
    username: string;
    activo?: boolean;
    fecha_baja?: string | null;
    motivo_baja?: string | null;
}

interface RespuestaEmpleadoMarcajes {
    message: string;
    empleado:
        EmpleadoMarcajesRespuesta;
}

interface RespuestaSincronizacionMarcajes {
    message: string;
    sincronizado: boolean;
    empleado:
        EmpleadoMarcajesRespuesta |
        null;
}

const MARCAJES_API_URL =
    process.env.MARCAJES_API_URL ||
    "http://marcajes-api:4100/marcajes-api/api";

async function ejecutarPeticionMarcajes<T>(
    url: string,
    opciones: RequestInit
): Promise<T> {
    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            () =>
                controller.abort(),
            10000
        );

    try {
        const response =
            await fetch(
                url,
                {
                    ...opciones,
                    signal:
                        controller.signal
                }
            );

        const contenido =
            await response
                .json()
                .catch(
                    () =>
                        null
                );

        if (!response.ok) {
            const mensaje =
                contenido?.message ||
                `Marcajes API respondió con estado ${response.status}`;

            throw new Error(
                mensaje
            );
        }

        return contenido as T;
    } catch (error) {
        if (
            error instanceof Error &&
            error.name ===
                "AbortError"
        ) {
            throw new Error(
                "Marcajes API no respondió dentro del tiempo esperado"
            );
        }

        throw error;
    } finally {
        clearTimeout(
            timeout
        );
    }
}

export const MarcajesIntegrationService = {
    async crearEmpleado(
        datos:
            CrearEmpleadoMarcajesDto,
        authorizationHeader:
            string
    ): Promise<RespuestaEmpleadoMarcajes> {
        if (!authorizationHeader) {
            throw new Error(
                "No se recibió el token de autorización para Marcajes"
            );
        }

        return ejecutarPeticionMarcajes<
            RespuestaEmpleadoMarcajes
        >(
            `${MARCAJES_API_URL}/empleado/create`,
            {
                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                    Authorization:
                        authorizationHeader
                },

                body:
                    JSON.stringify(
                        datos
                    )
            }
        );
    },

    async cambiarEstadoEmpleado(
        idAuth: number,
        datos:
            CambiarEstadoEmpleadoMarcajesDto,
        authorizationHeader:
            string
    ): Promise<RespuestaSincronizacionMarcajes> {
        if (!authorizationHeader) {
            throw new Error(
                "No se recibió el token de autorización para Marcajes"
            );
        }

        return ejecutarPeticionMarcajes<
            RespuestaSincronizacionMarcajes
        >(
            `${MARCAJES_API_URL}/empleado/changeActivoByAuth/${idAuth}`,
            {
                method:
                    "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",
                    Authorization:
                        authorizationHeader
                },

                body:
                    JSON.stringify(
                        datos
                    )
            }
        );
    },

    async actualizarEmpleado(
        idAuth: number,
        datos:
            ActualizarEmpleadoMarcajesDto,
        authorizationHeader:
            string
    ): Promise<RespuestaSincronizacionMarcajes> {
        if (!authorizationHeader) {
            throw new Error(
                "No se recibió el token de autorización para Marcajes"
            );
        }

        return ejecutarPeticionMarcajes<
            RespuestaSincronizacionMarcajes
        >(
            `${MARCAJES_API_URL}/empleado/updateIdentityByAuth/${idAuth}`,
            {
                method:
                    "PUT",

                headers: {
                    "Content-Type":
                        "application/json",
                    Authorization:
                        authorizationHeader
                },

                body:
                    JSON.stringify(
                        datos
                    )
            }
        );
    }
};