import { Request, Response } from "express";
import * as appService from "../services/appService";

export async function getApps(req: Request, res: Response) {
  try {
    const apps = await appService.getApps();
    return res.json(apps);
  } catch (err) {
    console.error("Error en getApps:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function createApp(req: Request, res: Response) {
  try {
    const result = await appService.createApp(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error("Error en createApp:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function deleteApp(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await appService.deleteApp(id);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error("Error en deleteApp:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}
