import {
    Navigate
} from "react-router-dom";

import type {
    JSX
} from "react";

import {
    useSession
} from "../hooks/useSession";

import type {
    Rol
} from "../models/rol";


export function PublicRoute({
    children
}: {
    children:
        JSX.Element;
}) {
    const {
        empleado
    } =
        useSession();


    /*
     * IMPORTANTE:
     *
     * No usamos "loading" aquí.
     *
     * loading también se activa cuando el usuario
     * presiona Iniciar sesión.
     *
     * Si desmontamos el LoginPage durante esa petición,
     * se pierde el estado local del mensaje de error.
     */
    if (
        empleado
    ) {
        const home =
            getHomeByRoles(
                empleado.roles
            );


        return (
            <Navigate
                to={
                    home
                }
                replace
            />
        );
    }


    return children;
}


function getHomeByRoles(
    roles:
        Rol[]
): string {
    if (
        roles.some(
            (
                rol
            ) =>
                rol.codigo ===
                    "ADM-PMW" &&
                rol.en_uso
        )
    ) {
        return "/admin";
    }


    if (
        roles.some(
            (
                rol
            ) =>
                rol.codigo ===
                    "SUP-PMW" &&
                rol.en_uso
        )
    ) {
        return "/supervisor-home";
    }


    if (
        roles.some(
            (
                rol
            ) =>
                rol.codigo ===
                    "COL-PMW" &&
                rol.en_uso
        )
    ) {
        return "/colaborador";
    }


    return "/login";
}