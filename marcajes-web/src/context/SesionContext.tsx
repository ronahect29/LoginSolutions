import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import {
    publicApi
} from "../services/api";

import type {
    AuthEmpleado
} from "../models/empleado";

import type {
    Rol
} from "../models/rol";

import {
    ES_LOCAL,
    isTokenExpired
} from "../utils/utils";


interface SessionContextValue {
    empleado:
        AuthEmpleado |
        null;

    token:
        string |
        null;

    loading:
        boolean;

    login: (
        correo:
            string,

        password:
            string,

        app:
            string
    ) =>
        Promise<void>;

    logout:
        () => void;
}


const SessionContext =
    createContext<
        SessionContextValue |
        undefined
    >(
        undefined
    );


export function SessionProvider({
    children
}: {
    children:
        ReactNode;
}) {
    const [
        empleado,
        setEmpleado
    ] =
        useState<
            AuthEmpleado |
            null
        >(
            null
        );


    const [
        token,
        setToken
    ] =
        useState<
            string |
            null
        >(
            null
        );


    const [
        loading,
        setLoading
    ] =
        useState<boolean>(
            true
        );


    // ======================================================
    // RESTAURAR SESIÓN
    // ======================================================

    useEffect(
        () => {
            const storedToken =
                localStorage.getItem(
                    "token_marcajes"
                );


            const storedEmpleado =
                localStorage.getItem(
                    "empleado"
                );


            if (
                storedToken &&
                storedEmpleado &&
                storedEmpleado !==
                    "undefined" &&
                !isTokenExpired(
                    storedToken
                )
            ) {
                try {
                    setToken(
                        storedToken
                    );


                    setEmpleado(
                        JSON.parse(
                            storedEmpleado
                        )
                    );
                } catch (
                    error
                ) {
                    console.error(
                        "Error al restaurar empleado:",
                        error
                    );


                    localStorage.removeItem(
                        "token_marcajes"
                    );


                    localStorage.removeItem(
                        "empleado"
                    );
                }
            }


            setLoading(
                false
            );
        },
        []
    );


    // ======================================================
    // LOGIN
    // ======================================================

    async function login(
        correo:
            string,

        password:
            string,

        app:
            string
    ): Promise<void> {
        setLoading(
            true
        );


        try {
            /*
             * Login utiliza publicApi.
             *
             * Los errores 401 y 403 deben llegar
             * directamente al LoginPage.
             */
            const res =
                await publicApi.post(
                    "/auth/login",
                    {
                        correo,
                        password,
                        app
                    }
                );


            const accessToken =
                res.data
                    .accessToken;


            const employ =
                res.data
                    .empleado;


            if (
                ES_LOCAL
            ) {
                console.log(
                    "SesionContext - Login Marcajes correcto:",
                    {
                        id_usuario:
                            employ.id_usuario,

                        id_empleado:
                            employ.id_empleado,

                        app
                    }
                );
            }


            const empleadoNormalize:
                AuthEmpleado = {
                id_usuario:
                    employ.id_usuario,

                id_empleado:
                    employ.id_empleado,

                correo:
                    employ.correo,

                nombre:
                    employ.nombre,

                username:
                    employ.username,

                roles:
                    mapRoles(
                        employ.roles
                    )
            };


            setToken(
                accessToken
            );


            setEmpleado(
                empleadoNormalize
            );


            localStorage.setItem(
                "token_marcajes",
                accessToken
            );


            localStorage.setItem(
                "empleado",
                JSON.stringify(
                    empleadoNormalize
                )
            );
        } catch (
            error
        ) {
            if (
                ES_LOCAL
            ) {
                console.log(
                    "SesionContext - Login Marcajes rechazado"
                );
            }


            throw error;
        } finally {
            setLoading(
                false
            );
        }
    }


    // ======================================================
    // LOGOUT
    // ======================================================

    function logout() {
        setEmpleado(
            null
        );


        setToken(
            null
        );


        localStorage.removeItem(
            "token_marcajes"
        );


        localStorage.removeItem(
            "empleado"
        );
    }


    const value:
        SessionContextValue = {
        empleado,
        token,
        loading,
        login,
        logout
    };


    return (
        <SessionContext.Provider
            value={
                value
            }
        >
            {
                children
            }
        </SessionContext.Provider>
    );
}


export function useSessionContext() {
    const ctx =
        useContext(
            SessionContext
        );


    if (!ctx) {
        throw new Error(
            "useSessionContext debe ser usado dentro de un SessionProvider"
        );
    }


    return ctx;
}


function mapRoles(
    rawRoles:
        any[]
): Rol[] {
    return rawRoles.map(
        (
            rol
        ) => ({
            id_rol:
                rol.id_rol ??
                rol.id ??
                0,

            nombre:
                rol.nombre ??
                "",

            codigo:
                rol.codigo,

            descripcion:
                rol.descripcion ??
                "",

            activo:
                rol.activo ??
                true,

            en_uso:
                rol.en_uso ??
                true,

            por_defecto:
                rol.por_defecto ??
                true,

            aplicacion:
                rol.aplicacion
        })
    );
}