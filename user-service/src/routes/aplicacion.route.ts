import { Router } from "express";
import * as AplicacionController from "../controllers/aplicacion.controller";
import { requireAuth } from "../middlewares/authMiddleware";

const aplicacionRoutes = Router();
aplicacionRoutes.get("/findByActivo/:activo", requireAuth, AplicacionController.getAplicacionesByActivo);
export default aplicacionRoutes;
