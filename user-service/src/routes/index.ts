import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import roleRoutes from "./roleRoutes";
import appRoutes from "./appRoutes";
import rolRoutes from "./rol.route";
import aplicacionRoutes from "./aplicacion.route";
// ORM
import usuarioRoutes from "./usuario.route";
import configuracionUsuarioRolRoutes from "./configuracionUsuarioRol.route";
import sessionRoutes from "./session.route";
import datosRoutes from "./datos.route";
const router = Router();

// router.use("/auth", authRoutes);
router.use("/session", sessionRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/apps", appRoutes);

// ORM
router.use("/usuarios", usuarioRoutes);
router.use("/configuracion-usuario-rol", configuracionUsuarioRolRoutes);
router.use("/rol", rolRoutes);
router.use("/aplicacion", aplicacionRoutes);
router.use("/datos", datosRoutes);



export default router;