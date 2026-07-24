import { Router } from "express";
import { ConfiguracionUsuarioRolController } from "../controllers/configuracionUsuarioRol.controller";
const configuracionUsuarioRolRoutes = Router();

configuracionUsuarioRolRoutes.get("/findAll", ConfiguracionUsuarioRolController.findAll);
configuracionUsuarioRolRoutes.get("/findOne/:id", ConfiguracionUsuarioRolController.findOne);
configuracionUsuarioRolRoutes.post("/create", ConfiguracionUsuarioRolController.create);
configuracionUsuarioRolRoutes.get("/findRolesByUsuarioIdAndAplicacionCodigo/:id/:codeApp", ConfiguracionUsuarioRolController.findRolesByUsuarioIdAndAplicacionCodigo);
export default configuracionUsuarioRolRoutes;