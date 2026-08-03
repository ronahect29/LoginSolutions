export interface CrearEmpleadoMarcajesDto {
    id_auth: number;
    correo: string;
    nombre: string;
    username: string;
    direccion?: string | null;
    telefono?: string | null;
}

interface RespuestaEmpleadoMarcajes {
    message: string;
    empleado: {
        id_empleado: number;
        id_auth: number;
        correo: string;
        nombre: string;
        username: string;
    };
}

const MARCAJES_API_URL =
    process.env.MARCAJES_API_URL ||
    "http://marcajes-api:4100/marcajes-api/api";

export const MarcajesIntegrationService = {
    async crearEmpleado(
        datos: CrearEmpleadoMarcajesDto,
        authorizationHeader: string
    ): Promise<RespuestaEmpleadoMarcajes> {
        if (!authorizationHeader) {
            throw new Error(
                "No se recibió el token de autorización para Marcajes"
            );
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(
                `${MARCAJES_API_URL}/empleado/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authorizationHeader
                    },
                    body: JSON.stringify(datos),
                    signal: controller.signal
                }
            );

            const contenido = await response.json().catch(() => null);

            if (!response.ok) {
                const mensaje =
                    contenido?.message ||
                    `Marcajes API respondió con estado ${response.status}`;

                throw new Error(mensaje);
            }

            return contenido as RespuestaEmpleadoMarcajes;
        } catch (error) {
            if (
                error instanceof Error &&
                error.name === "AbortError"
            ) {
                throw new Error(
                    "Marcajes API no respondió dentro del tiempo esperado"
                );
            }

            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }
};