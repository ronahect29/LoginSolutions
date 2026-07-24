import { Request, Response } from "express";
import * as rolService from "../services/rol.service";

export async function getRolesByActivoAndApp(req: Request, res: Response) {
    try {
        const { activo, id_app } = req.params;
        if (!activo || (activo !== "true" && activo !== "false")) {
            console.error("rol.controller - getRolesByActivoAndApp: Param 'activo' inválido");
            return res.status(400).json({ message: "Param 'activo' inválido" });
        }
        if (!id_app || isNaN(Number(id_app))) {
            console.error("rol.controller - getRolesByActivoAndApp: Param 'id_app' inválido");
            return res.status(400).json({ message: "Param 'id_app' inválido" });
        }
        const activoBool = activo === "true";
        const roles = await rolService.RolService.findRolesByActivoAndApp(activoBool, Number(id_app));
        return res.json(roles);
    } catch (err) {
        console.error("rol.controller - getRolesByActivoAndApp: ", err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}
export async function getRolesByActivoAndCodigosAplicacionActivo(req: Request, res: Response) {
    try {
        const { activo, appsCodes } = req.body;
        if (activo === undefined || typeof activo !== "boolean") {
            console.error("rol.controller - getRolesByActivoAndCodigosAplicacionActivo: Param 'activo' inválido");
            return res.status(400).json({ message: "Param 'activo' inválido" });
        }
        if (!appsCodes || !Array.isArray(appsCodes) || appsCodes.some(code => typeof code !== "string")) {
            console.error("rol.controller - getRolesByActivoAndCodigosAplicacionActivo: Param 'appsCodes' inválido");
            return res.status(400).json({ message: "Param 'appsCodes' inválido" });
        }
        const roles = await rolService.RolService.findRolesByActivoAndCodigosAplicacionActivo(activo, appsCodes);
        return res.json(roles);
    } catch (err) {
        console.error("rol.controller - getRolesByActivoAndCodigosAplicacionActivo: ", err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}