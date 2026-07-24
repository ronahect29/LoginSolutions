import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { requireAuth } from "../middlewares/authMiddleware";

const usuarioRoutes = Router();
usuarioRoutes.get("/findAll", requireAuth, UsuarioController.getAll);
usuarioRoutes.get("/findOne/:id", requireAuth, UsuarioController.findByUsuarioId);
usuarioRoutes.post("/create", requireAuth, UsuarioController.create);
usuarioRoutes.get("/findAllWithRolesAndApps", requireAuth, UsuarioController.findAllWithRolesAndApps);
usuarioRoutes.post("/findByFilters", requireAuth, UsuarioController.findByFilters);
usuarioRoutes.patch("/changeActivo/:id", requireAuth, UsuarioController.changeUsuarioActivoById);
export default usuarioRoutes;