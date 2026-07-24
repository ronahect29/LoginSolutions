import { Request, Response } from "express";
import { SucursalService } from "../services/sucursal.service";

export const SucursalController = {
    async getAll(_req: Request, res: Response) {
        try {
            const data = SucursalService.findAll();
            return res.json(data);
        } catch (err) {
            console.error("Error en getAll - sucursal.controller: ", err);
            return res.status(500).json({ message: "Error obteniendo sucursales" })
        }
    },
    async findByActivo(req: Request, res: Response) {
        const activo = req.params.activo
        if (!activo) {
            console.log("sucursal.controller - No se ha incluido el parámetro 'activo'");
            return res.status(400).json({ message: "Falta el parámetro 'activo'." });
        }
        if (activo !== "true" && activo !== "false") {
            console.log("sucursal.controller - Valor de 'activo' inválido.");
            return res.status(400).json({ message: "Parámetro 'activo' inválido." });
        }
        const activoBool = activo === "true";
        try {
            const data = await SucursalService.findByActivo(activoBool);
            return res.json(data);
        } catch (err) {
            console.error("sucursal.controller - findByActivo - error al obtener sucursales: ", err);
            return res.status(500).json({ message: "Error obteniendo sucursales." });
        }

    }
}