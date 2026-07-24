import { Request, Response } from "express";
import * as userService from "../services/userService";

export async function getAllUsers(req: Request, res: Response) {
  try {
    const result = await userService.getAllUsers();
    return res.json(result);
  } catch (err) {
    console.error("Error en getAllUsers:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);
    const result = await userService.getUserById(userId);
    if (!result) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json(result);
  } catch (err) {
    console.error("Error en getUserById:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function assignRole(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);
    const roleId = Number(req.body.roleId);

    const result = await userService.assignRole(userId, roleId);
    return res.status(result.status).json(result.body);

  } catch (err) {
    console.error("Error en assignRole:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function removeRole(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);
    const roleId = Number(req.params.roleId);

    const result = await userService.removeRole(userId, roleId);
    return res.status(result.status).json(result.body);

  } catch (err) {
    console.error("Error en removeRole:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}
