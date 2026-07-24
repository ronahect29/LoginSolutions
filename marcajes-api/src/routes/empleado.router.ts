import { Router } from "express";
import { EmpleadoController } from "../controllers/empleado.controller";
import { requireAuth } from "../middlewares/sessionMiddleware";
const router = Router();
router.get("/findAll", requireAuth, EmpleadoController.getAll);
export default router;