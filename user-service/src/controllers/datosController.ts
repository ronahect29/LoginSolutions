import { Request, Response } from "express";
import * as datosService from "../services/datosService";

export async function getTotalEntidades(req: Request, res: Response) {
    try {
        const activo = req.params.activo
        const activoBool = activo === "true"
        const result = await datosService.getTotalEntidadesByActivo(activoBool);
        res.status(200).json(result);
    } catch (err) {
        console.error("datosController-getTotalCantidades: ", err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }

}