import { Request, Response } from "express";
import * as sesionService from "../services/sesionService";

export async function login(req: Request, res: Response) {
    const result = await sesionService.login(req.body);
    console.log("sesionController - Login Body Request: ", req.body);
    res.status(result.status).json(result.body)
}
export async function logout(req: Request, res: Response) {
    const result = await sesionService.logout(req.body);
    res.status(result.status).json(result.body);
}