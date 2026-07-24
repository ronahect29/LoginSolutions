import { Router } from "express";
import { SucursalController } from "../controllers/sucursal.controller";
import { requireAuth } from "../middlewares/sessionMiddleware";

const router = Router();

router.get("/findByActivo/:activo", requireAuth, SucursalController.findByActivo);

export default router;