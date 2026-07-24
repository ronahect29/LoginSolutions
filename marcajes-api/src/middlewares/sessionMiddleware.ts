import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { verifyToken } from "../utils/jwt";

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "Token requerido" });

    const token = auth.split(" ")[1];

    try {
        req.user = verifyToken(token);
        next();
    } catch {
        return res.status(401).json({ message: "Token inválido" });
    }
}