import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import * as roleController from "../controllers/roleController";

const router = Router();

// Lista de roles por aplicación
router.get(
  "/app/:appCode",
  requireAuth,
  requireRole(["SA-PAW"]),
  roleController.getRolesByApp
);

// Crear un rol
router.post(
  "/",
  requireAuth,
  requireRole(["SA-PAW"]),
  roleController.createRole
);

// Eliminar un rol
router.delete(
  "/:roleId",
  requireAuth,
  requireRole(["SA-PAW"]),
  roleController.deleteRole
);

export default router;
