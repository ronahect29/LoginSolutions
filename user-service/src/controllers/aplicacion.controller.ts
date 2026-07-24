import { Request, Response } from 'express';
import * as aplicacionService from "../services/aplicacion.service";
import { ES_LOCAL } from '../utils/constantes';

export async function getAplicacionesByActivo(req: Request, res: Response) {
    if (ES_LOCAL) {
        console.log("aplicacion.controller - getAplicacionesByActivo: Iniciando función");
    }
    try {
        const { activo } = req.params;
        if (!activo || (activo !== "true" && activo !== "false")) {
            console.error("aplicacion.controller - getAplicacionesByActivo: Param 'activo' inválido");
            return res.status(400).json({ message: "Param 'activo' inválido" });
        }
        const activoBool = activo === "true";
        const aplicaciones = await aplicacionService.AplicacionService.findAppsByActivo(activoBool);
        if (ES_LOCAL) {
            console.log("aplicacion.controller - getAplicacionesByActivo: Aplicaciones encontradas:", aplicaciones);
        }
        return res.json(aplicaciones);
    } catch (err) {
        console.error("aplicacion.controller - getAplicacionesByActivo: ", err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}