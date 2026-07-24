import { Request, Response } from "express";
import { ConfiguracionUsuarioRolService } from "../services/configuracionUsuarioRol.service";

export const ConfiguracionUsuarioRolController = {
    async findAll(req: Request, res: Response) {
        try {
            const data = await ConfiguracionUsuarioRolService.findAll();
            return res.json(data);
        } catch (err) {
            console.error("Error en findAll:", err);
            return res.status(500).json({ message: "Error interno" });
        }
    },
    findOne(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data = ConfiguracionUsuarioRolService.findOne(id);
            return res.json(data);
        } catch (err) {
            console.error("Error en findOne:", err);
            return res.status(500).json({ message: "Error interno" });
        }
    },
    async findRolesByUsuarioIdAndAplicacionCodigo(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const codeApp = String(req.params.codeApp);
            const data = await ConfiguracionUsuarioRolService.findRolesByUsuarioIdAndAplicacionCodigo(id, codeApp);
            return res.json(data);
        } catch (err) {
            console.error("Error en findRolesByUsuarioIdAndAplicacionCodigo:", err);
            return res.status(500).json({ message: "Error interno" });
        }
    },
    async create(req: Request, res: Response) {
        try {
            const data = await ConfiguracionUsuarioRolService.create(req.body);
            return res.status(201).json(data);
        } catch (err) {
            console.error("Error en create:", err);
            return res.status(500).json({ message: "Error interno" });
        }
    }

};