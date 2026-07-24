import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import * as datosController from "../controllers/datosController";

const datosRouter = Router();

datosRouter.get("/getTotalEntidadesByActivo/:activo", datosController.getTotalEntidades);

export default datosRouter;