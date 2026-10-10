import {
    Navigate
} from "react-router-dom";

import type {
    JSX
} from "react";

import {
    useSession
} from "../hooks/useSession";

import {
    getHomeByRoles
} from "../utils/utils";


export function PublicRoute({
    children
}: {
    children:
        JSX.Element;
}) {
    const {
        usuario
    } =
        useSession();


    /*
     * No utilizamos "loading".
     *
     * loading cambia también durante el proceso
     * de autenticación y no debe desmontar el login.
     */
    if (
        usuario
    ) {
        const home =
            getHomeByRoles(
                usuario.roles
            );


        return (
            <Navigate
                to={`/admin/${home}`}
                replace
            />
        );
    }


    return children;
}