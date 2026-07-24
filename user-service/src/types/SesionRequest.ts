import { Request } from "express";
import { JwtPayload } from "./index";
export interface SesionRequest extends Request {
    sesion?: JwtPayload;
}