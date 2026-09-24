import {
    type Request,
    type Response,
} from "express";

import {
    type AuthRequest,
} from "../types/AuthRequest";
import * as sesionService from "../services/sesionService";

// ======================================================
// LOGIN
// ======================================================

export async function login(
    req: Request,
    res: Response
) {
    const result =
        await sesionService.login(
            req.body
        );

    console.log(
        "sesionController - Login Body Request:",
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

// ======================================================
// VALIDAR SESIÓN
// ======================================================

export async function validate(
    req: AuthRequest,
    res: Response
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
    req: Request,
    res: Response
) {
    const result =
        await sesionService.logout(
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