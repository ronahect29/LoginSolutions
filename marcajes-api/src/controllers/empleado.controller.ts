import { Request, Response } from "express";
import { EmpleadoService } from "../services/empleado.service";

export const EmpleadoController = {
    async getAll(req: Request, res: Response) {
        const data = await EmpleadoService.findAll();
        return res.json(data);
    },

    async findOne(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = await EmpleadoService.findOne(id);
        res.json(data);
    },
    async findByByCorreoAndIdAuth(req: Request, res: Response) {
        const { correo, id_auth } = req.params
        if (!correo || !id_auth) {
            console.error("empleado.controller: faltan parámetros", JSON.stringify(req.params));
            return res.status(400).json({ message: "Faltan parámetros obligatorios" });
        }
        const data = await EmpleadoService.findByCorreoAndIdAuth(correo, Number(res));
        res.json(data);
    },
    async create(req: Request, res: Response) {
        const data = await EmpleadoService.create(req.body);
        res.json(data);
    }
};