import {
    Router,
} from "express";

import {
    MarcajeController,
} from "../controllers/marcajesController";
import {
    VwMarcajesController,
} from "../controllers/vwMarcajesController";
import {
    requireAuth,
} from "../middlewares/sessionMiddleware";

const router =
    Router();

// ======================================================
// MARCAJES
// ======================================================

router.get(
    "/findAll",
    requireAuth,
    MarcajeController.getAll
);

router.get(
    "/findByEmpleadoAndFecha/:id_empleado/:fecha",
    requireAuth,
    MarcajeController
        .findMarcajeByEmpleadoAndFecha
);

router.get(
    "/findOne/:id",
    requireAuth,
    MarcajeController.findOne
);

router.post(
    "/registrar/",
    requireAuth,
    MarcajeController.createMarcaje
);

router.post(
    "/create",
    requireAuth,
    MarcajeController.create
);

// ======================================================
// REPORTES
// ======================================================

router.get(
    "/findAllMarcajes",
    requireAuth,
    VwMarcajesController.getAll
);

router.post(
    "/findByFilters",
    requireAuth,
    VwMarcajesController
        .reporteMarcajesByFilters
);

router.post(
    "/MarcajesReporteExcel",
    requireAuth,
    VwMarcajesController
        .exporReporteMarcajesByFilters
);

export default router;