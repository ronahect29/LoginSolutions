import { Request, Response } from "express";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.status(result.status).json(result.body);
}
export async function login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    console.log("Login body request:", req.body);
    //res.status(result.status).json(result.body);
}

export async function logout(req: Request, res: Response) {
    const result = await authService.logout(req.body);
    res.status(result.status).json(result.body);
}

/*export async function refreshToken(req: Request, res: Response) {
    const result = await authService.refreshToken(req.body);
    res.status(result.status).json(result.body);
}*/