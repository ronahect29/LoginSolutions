import axios from "axios";

import {
    UserServiceLoginResponse
} from "../models/user";


const AUTH_SERVICE_URL =
    process.env.AUTH_SERVICE_URL ||
    "http://user-service:4000/user-service/api/session/";


interface AuthErrorResponse {
    code?: string;
    message: string;
}


type ProxyLoginResponse =
    | {
        ok: true;
        status: 200;
        data: UserServiceLoginResponse;
    }
    | {
        ok: false;
        status: number;
        error: AuthErrorResponse;
    };


export async function proxyLogin(
    correo: string,
    password: string,
    app: string
): Promise<ProxyLoginResponse> {
    try {
        const response =
            await axios.post<UserServiceLoginResponse>(
                `${AUTH_SERVICE_URL}login`,
                {
                    correo,
                    password,
                    app
                },
                {
                    timeout:
                        5000
                }
            );


        return {
            ok:
                true,

            status:
                200,

            data:
                response.data
        };
    } catch (
        error:
            any
    ) {
        // ==================================================
        // USER-SERVICE RESPONDIÓ CON UN ERROR HTTP
        // ==================================================

        if (
            error?.response
        ) {
            const status =
                Number(
                    error.response.status
                ) ||
                500;


            const data =
                error.response.data;


            return {
                ok:
                    false,

                status,

                error: {
                    code:
                        data?.code,

                    message:
                        data?.message ||
                        "No fue posible iniciar sesión."
                }
            };
        }


        // ==================================================
        // USER-SERVICE NO RESPONDIÓ
        // ==================================================

        if (
            error?.request
        ) {
            console.error(
                "authProxyService - user-service no disponible:",
                error?.message
            );


            return {
                ok:
                    false,

                status:
                    503,

                error: {
                    code:
                        "AUTH_SERVICE_UNAVAILABLE",

                    message:
                        "El servicio de autenticación no se encuentra disponible. Intenta nuevamente."
                }
            };
        }


        // ==================================================
        // ERROR INESPERADO
        // ==================================================

        console.error(
            "authProxyService - Error inesperado:",
            error
        );


        return {
            ok:
                false,

            status:
                500,

            error: {
                code:
                    "AUTH_INTERNAL_ERROR",

                message:
                    "No fue posible iniciar sesión. Intenta nuevamente."
            }
        };
    }
}