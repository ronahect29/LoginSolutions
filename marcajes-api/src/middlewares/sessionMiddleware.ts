import axios from "axios";
import {
    type NextFunction,
    type Response,
} from "express";

import {
    type AuthRequest,
} from "../types/AuthRequest";
import {
    verifyToken,
} from "../utils/jwt";

// ======================================================
// CONFIGURACIÓN
// ======================================================

const AUTH_SERVICE_URL =
    process.env.AUTH_SERVICE_URL ||
    "http://user-service:4000/user-service/api/session/";

// ======================================================
// HELPERS
// ======================================================

function buildAuthUrl(
    endpoint: string
): string {
    const base =
        AUTH_SERVICE_URL.endsWith(
            "/"
        )
            ? AUTH_SERVICE_URL
            : `${AUTH_SERVICE_URL}/`;

    return `${base}${endpoint}`;
}

// ======================================================
// AUTENTICACIÓN
// ======================================================

export async function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const auth =
        req.headers.authorization;

    if (!auth) {
        return res.status(401).json({
            message:
                "Token requerido",
        });
    }

    const [
        scheme,
        token,
    ] =
        auth.split(" ");

    if (
        scheme !== "Bearer" ||
        !token
    ) {
        return res.status(401).json({
            message:
                "Token inválido",
        });
    }

    // ======================================================
    // VALIDACIÓN LOCAL DEL JWT
    // ======================================================

    try {
        req.user =
            verifyToken(
                token
            );
    } catch {
        return res.status(401).json({
            message:
                "Token inválido",
        });
    }

    // ======================================================
    // VALIDACIÓN CENTRAL DE SESIÓN
    // ======================================================

    try {
        const response =
            await axios.get(
                buildAuthUrl(
                    "validate"
                ),
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    timeout:
                        3000,

                    validateStatus:
                        () => true,
                }
            );

        if (
            response.status ===
            200
        ) {
            return next();
        }

        if (
            response.status ===
            401
        ) {
            return res.status(401).json(
                response.data
            );
        }

        if (
            response.status ===
            403
        ) {
            return res.status(403).json(
                response.data
            );
        }

        console.error(
            "sessionMiddleware - Respuesta inesperada de user-service:",
            response.status,
            response.data
        );

        return res.status(503).json({
            message:
                "No fue posible validar la sesión.",
        });
    } catch (error) {
        console.error(
            "sessionMiddleware - Error consultando user-service:",
            error
        );

        return res.status(503).json({
            message:
                "Servicio de autenticación no disponible.",
        });
    }
}