import {
    type Request,
    type Response
} from "express";

import {
    type AuthRequest
} from "../types/AuthRequest";

import * as sesionService
    from "../services/sesionService";


// ======================================================
// LOGIN
// ======================================================

export async function login(
    req:
        Request,

    res:
        Response
) {
    const result =
        await sesionService
            .login(
                req.body
            );


    /*
     * Nunca registrar contraseña.
     *
     * Únicamente dejamos información técnica
     * segura para diagnóstico.
     */
    console.log(
        "sesionController - Intento de login:",
        {
            correo:
                typeof req.body
                    ?.correo ===
                    "string"
                    ? req.body
                        .correo
                        .trim()
                    : null,

            app:
                typeof req.body
                    ?.app ===
                    "string"
                    ? req.body
                        .app
                        .trim()
                    : null,

            resultado:
                result.status
        }
    );


    return res
        .status(
            result.status
        )
        .json(
            result.body
        );
}


// ======================================================
// VALIDAR SESIÓN
// ======================================================

export async function validate(
    req:
        AuthRequest,

    res:
        Response
) {
    const result =
        await sesionService
            .validateSession(
                req.user
            );


    return res
        .status(
            result.status
        )
        .json(
            result.body
        );
}


// ======================================================
// LOGOUT
// ======================================================

export async function logout(
    req:
        Request,

    res:
        Response
) {
    const result =
        await sesionService
            .logout(
                req.body
            );


    return res
        .status(
            result.status
        )
        .json(
            result.body
        );
}