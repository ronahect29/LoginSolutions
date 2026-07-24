import { Request, Response } from "express";
import * as roleService from "../services/roleService";

export async function getRolesByApp(req: Request, res: Response) {
  try {
    const appCode = req.params.appCode;
    const result = await roleService.getRolesByApp(appCode);
    return res.json(result);
  } catch (err) {
    console.error("Error en getRolesByApp:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function createRole(req: Request, res: Response) {
  try {
    const result = await roleService.createRole(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error("Error en createRole:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function deleteRole(req: Request, res: Response) {
  try {
    const roleId = Number(req.params.roleId);
    const result = await roleService.deleteRole(roleId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error("Error en deleteRole:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}
