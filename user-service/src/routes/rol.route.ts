import { Router } from "express";
import * as RolController from "../controllers/rol.controller";
import { requireAuth } from "../middlewares/authMiddleware";

const rolRoutes = Router();
rolRoutes.get("/findByActivoAndApp/:activo/:id_app", requireAuth, RolController.getRolesByActivoAndApp);
rolRoutes.post("/findByActivoAndCodigosAplicacionActivo", requireAuth, RolController.getRolesByActivoAndCodigosAplicacionActivo);
export default rolRoutes;