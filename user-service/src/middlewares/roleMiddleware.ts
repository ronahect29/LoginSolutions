import {
    type NextFunction,
    type Response,
} from "express";

import {
    type AuthRequest,
} from "../types/AuthRequest";

// ======================================================
// VALIDACIÓN DE ROLES
// ======================================================

export function requireRole(
    rolesPermitidos: string[]
) {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        // ======================================================
        // AUTENTICACIÓN
        // ======================================================

        if (!req.user) {
            return res.status(401).json({
                message:
                    "No autenticado.",
            });
        }

        // ======================================================
        // ROLES DEL USUARIO
        // ======================================================

        const rolesUsuario =
            Array.isArray(
                req.user.roles
            )
                ? req.user.roles
                : [];

        // ======================================================
        // AUTORIZACIÓN
        // ======================================================

        const autorizado =
            rolesUsuario.some(
                (rol) =>
                    rolesPermitidos.includes(
                        rol
                    )
            );

        if (!autorizado) {
            return res.status(403).json({
                message:
                    "No autorizado.",
            });
        }

        // ======================================================
        // CONTINUAR
        // ======================================================

        next();
    };
}