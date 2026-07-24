import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import * as userController from "../controllers/userController";

const router = Router();

// Obtener todos los usuarios (solo admin del sistema)
router.get(
  "/", 
  requireAuth, 
  requireRole(["SA-PAW"]), 
  userController.getAllUsers
);

// Obtener un usuario específico
router.get(
  "/:id",
  requireAuth,
  requireRole(["SA-PAW"]),
  userController.getUserById
);

// Asignar rol a usuario
router.post(
  "/:id/roles",
  requireAuth,
  requireRole(["SA-PAW"]),
  userController.assignRole
);

// Quitar rol
router.delete(
  "/:id/roles/:roleId",
  requireAuth,
  requireRole(["SA-PAW"]),
  userController.removeRole
);

export default router;
