import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { JwtPayload } from "jsonwebtoken";
import { SesionRequest } from "../types/SesionRequest";

// export function requireRole(roles: string[]) {
//     return (req: AuthRequest, res: Response, next: NextFunction) => {
//         if (!req.user) return res.status(401).json({ message: "No autenticado" });

// const hasRole = req.user.roles.some(r => roles.includes(r));
// if (!hasRole) return res.status(403).json({ message: "No autorizado" });
//         next();
//     };
// }
export function requireRole(roles: string[]) {
    return (req: SesionRequest, res: Response, next: NextFunction) => {
        if (!req.sesion) return res.status(401).json({ message: "No autenticado." });
        const hasRole = req.sesion.roles.some(r => roles.includes(r));
        if (!hasRole) return res.status(403).json({ message: "No autorizado" });
        next();
    }
}