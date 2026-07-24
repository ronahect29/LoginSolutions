import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}