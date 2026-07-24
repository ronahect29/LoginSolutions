import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import * as appController from "../controllers/appController";

const router = Router();

// Listar todas las apps
router.get(
  "/",
  requireAuth,
  requireRole(["SA-PAW"]),
  appController.getApps
);

// Crear app
router.post(
  "/",
  requireAuth,
  requireRole(["SA-PAW"]),
  appController.createApp
);

// Eliminar app
router.delete(
  "/:id",
  requireAuth,
  requireRole(["SA-PAW"]),
  appController.deleteApp
);

export default router;
