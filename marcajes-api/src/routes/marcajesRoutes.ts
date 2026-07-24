import { Router } from "express";
import { MarcajeController } from "../controllers/marcajesController";
import { requireAuth } from "../middlewares/sessionMiddleware";
import { VwMarcajesController } from "../controllers/vwMarcajesController";

const router = Router();
router.get("/findAll", requireAuth, MarcajeController.getAll);
router.get("/findByEmpleadoAndFecha/:id_empleado/:fecha", requireAuth, MarcajeController.findMarcajeByEmpleadoAndFecha);
router.get("/findOne/:id", requireAuth, MarcajeController.findOne);
router.post("/registrar/", requireAuth, MarcajeController.createMarcaje);
router.post("/create", requireAuth, MarcajeController.create);
router.get("/findAllMarcajes", requireAuth, VwMarcajesController.getAll);
router.post("/findByFilters", requireAuth, VwMarcajesController.reporteMarcajesByFilters);
router.post("/MarcajesReporteExcel", VwMarcajesController.exporReporteMarcajesByFilters);

export default router;