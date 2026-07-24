import { Request, Response } from "express";
import { proxyLogin } from "../services/authProxyService";
import { ES_LOCAL } from "../utils/utilidades";
import { EmpleadoService } from "../services/empleado.service";

export async function login(req: Request, res: Response) {
    const { correo, password, app } = req.body;
    if (!correo || !password || !app) {
        return res.status(400).json({ message: "Faltan parámetros obligatorios" });
    }
    if (ES_LOCAL)
        console.log("AUTHCONTROLLER. INICIA PROCESO ENVIO LOGIN A USER-SERVICE")
    const existeEnApp = await EmpleadoService.findByCorreo(correo);
    if (!existeEnApp) {
        return res.status(404).json({ message: "Este usuario no existe en esta plataforma" });
    }

    const result = await proxyLogin(correo, password, app);
    if (ES_LOCAL)
        console.log("AUTHCONTROLLER. FINALIZA PROCESO ENVIO LOGIN A USER-SERVICE")
    if (!result.ok) {
        if (ES_LOCAL)
            console.log("AUTHCONTROLLER. ERROR RESULT NO ES OK ", result.error)
        return res.status(401).json(result.error);
    }
    if (ES_LOCAL)
        console.log("AUTHCONTROLLER. ENVIANDO LOGIN CORRECTO")
    return res.status(200).json({
        ...result.data,
        empleado: {
            ...result.data.empleado,
            id_empleado: existeEnApp.id_empleado
        }
    });
}