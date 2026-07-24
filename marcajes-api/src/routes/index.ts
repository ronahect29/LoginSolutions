import { Router } from "express";
import authRoutes from "./authRoutes";
import empleadoRoutes from "./empleado.router";
import marcajeRoutes from "./marcajesRoutes";
import sucursalRouter from "./sucursalRoutes";
const router = Router();
router.use("/auth", authRoutes);
router.use("/empleado/", empleadoRoutes)
router.use("/marcaje/", marcajeRoutes);
router.use("/sucursal/", sucursalRouter);
export default router;