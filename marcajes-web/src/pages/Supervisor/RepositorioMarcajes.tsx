import {
    useEffect,
    useMemo,
    useState
} from "react";

import type {
    FiltrosMarcajes,
    MarcajeReporteDto
} from "../../models/marcaje";

import type {
    FiltroSucursal
} from "../../models/sucursal";

import { api } from "../../services/api";

import {
    FiltroMarcajesComponent
} from "./components/FiltroMarcajesComponent";

import {
    MarcajesTableComponent
} from "./components/MarcajesTableComponent";

import excelIcon from "../../assets/excel_icon.png";

import "../../styles/RepositorioMarcajes.css";


// ======================================================
// FILTROS INICIALES
// ======================================================

const initialFilters: FiltrosMarcajes = {
    fechaDesde: null,
    fechaHasta: null,
    sucursales: null,
    fueraDeRango: null,
    jefeId: null,
    empleadoId: null
};


// ======================================================
// ICONOS
// ======================================================

function ReportIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path d="M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H18v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
            <path d="M8 7h6" />
            <path d="M8 11h6" />
            <path d="M8 15h4" />
        </svg>
    );
}


function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 2.5 2.5L16 9" />
        </svg>
    );
}


function ClockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}


function BranchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path d="M3 21h18" />
            <path d="M5 21V7l7-4 7 4v14" />
            <path d="M9 21v-5h6v5" />
        </svg>
    );
}


// ======================================================
// COMPONENTE
// ======================================================

export function RepositorioMarcajes() {
    const [
        rows,
        setRows
    ] = useState<MarcajeReporteDto[]>([]);

    const [
        draftFilters,
        setDraftFilters
    ] = useState<FiltrosMarcajes>(
        initialFilters
    );

    const [
        appliedFilters,
        setAppliedFilters
    ] = useState<FiltrosMarcajes>(
        initialFilters
    );

    const [
        sucursales,
        setSucursales
    ] = useState<FiltroSucursal[]>([]);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState<string | null>(
        null
    );


    // ======================================================
    // CARGA DE SUCURSALES
    // ======================================================

    useEffect(() => {
        api.get<FiltroSucursal[]>(
            "/sucursal/findByActivo/true"
        )
            .then((res) => {
                setSucursales(
                    res.data
                );
            })
            .catch((err) => {
                console.error(
                    "Error cargando sucursales",
                    err
                );
            });
    }, []);


    // ======================================================
    // CARGA DE MARCAJES
    // ======================================================

    async function fetchMarcajes(
        filters: FiltrosMarcajes
    ) {
        setLoading(true);
        setError(null);

        try {
            const res =
                await api.post<MarcajeReporteDto[]>(
                    "/marcaje/findByFilters",
                    filters
                );

            setRows(
                res.data
            );
        } catch (err) {
            console.error(
                "Error cargando marcajes",
                err
            );

            setError(
                "No fue posible generar el reporte de marcajes."
            );
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        void fetchMarcajes(
            initialFilters
        );
    }, []);


    // ======================================================
    // RESUMEN
    // ======================================================

    const resumen = useMemo(() => {
        const jornadasCompletas =
            rows.filter(
                (row) =>
                    Boolean(
                        row.hora_entrada
                    ) &&
                    Boolean(
                        row.hora_salida
                    )
            ).length;

        const pendientesSalida =
            rows.filter(
                (row) =>
                    Boolean(
                        row.hora_entrada
                    ) &&
                    !row.hora_salida
            ).length;

        const sucursalesReportadas =
            new Set(
                rows
                    .map(
                        (row) =>
                            row.sucursal_nombre
                    )
                    .filter(Boolean)
            ).size;

        return {
            total:
                rows.length,

            jornadasCompletas,

            pendientesSalida,

            sucursalesReportadas
        };
    }, [rows]);


    // ======================================================
    // ACCIONES DE FILTRO
    // ======================================================

    function handleSearch() {
        setAppliedFilters(
            draftFilters
        );

        void fetchMarcajes(
            draftFilters
        );
    }


    function handleReset() {
        setDraftFilters(
            initialFilters
        );

        setAppliedFilters(
            initialFilters
        );

        void fetchMarcajes(
            initialFilters
        );
    }


    // ======================================================
    // EXPORTACIÓN EXCEL
    // ======================================================

    async function handleExportExcel() {
        try {
            setLoading(true);
            setError(null);

            const res =
                await api.post(
                    "/marcaje/MarcajesReporteExcel",
                    appliedFilters,
                    {
                        responseType:
                            "blob"
                    }
                );

            const blob =
                new Blob(
                    [res.data],
                    {
                        type:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    }
                );

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const enlace =
                document.createElement(
                    "a"
                );

            enlace.href =
                url;

            enlace.download =
                `reporte_marcajes_${Date.now()}.xlsx`;

            enlace.click();

            window.URL.revokeObjectURL(
                url
            );
        } catch (err) {
            console.error(
                "Error exportando Excel:",
                err
            );

            setError(
                "No fue posible exportar el reporte."
            );
        } finally {
            setLoading(false);
        }
    }


    // ======================================================
    // VISTA
    // ======================================================

    return (
        <main className="repo-page">
            <div className="repo-page__shell">

                {/* ======================================================
                    ENCABEZADO
                    ====================================================== */}

                <section className="repo-hero">
                    <div className="repo-hero__contenido">
                        <span className="repo-hero__icono">
                            <ReportIcon />
                        </span>

                        <div>
                            <span className="repo-hero__eyebrow">
                                Control de asistencia
                            </span>

                            <h1>
                                Repositorio de marcajes
                            </h1>

                            <p>
                                Consulta los registros de
                                entrada y salida, ubicación,
                                distancia y sucursal del
                                personal operativo.
                            </p>
                        </div>
                    </div>
                </section>


                {/* ======================================================
                    RESUMEN
                    ====================================================== */}

                <section className="repo-resumen">
                    <article className="repo-kpi">
                        <span className="repo-kpi__icono repo-kpi__icono--principal">
                            <ReportIcon />
                        </span>

                        <div>
                            <span>
                                Registros
                            </span>

                            <strong>
                                {resumen.total}
                            </strong>
                        </div>
                    </article>

                    <article className="repo-kpi">
                        <span className="repo-kpi__icono repo-kpi__icono--exito">
                            <CheckIcon />
                        </span>

                        <div>
                            <span>
                                Jornadas completas
                            </span>

                            <strong>
                                {
                                    resumen
                                        .jornadasCompletas
                                }
                            </strong>
                        </div>
                    </article>

                    <article className="repo-kpi">
                        <span className="repo-kpi__icono repo-kpi__icono--advertencia">
                            <ClockIcon />
                        </span>

                        <div>
                            <span>
                                Pendientes de salida
                            </span>

                            <strong>
                                {
                                    resumen
                                        .pendientesSalida
                                }
                            </strong>
                        </div>
                    </article>

                    <article className="repo-kpi">
                        <span className="repo-kpi__icono repo-kpi__icono--sucursal">
                            <BranchIcon />
                        </span>

                        <div>
                            <span>
                                Sucursales
                            </span>

                            <strong>
                                {
                                    resumen
                                        .sucursalesReportadas
                                }
                            </strong>
                        </div>
                    </article>
                </section>


                {/* ======================================================
                    FILTROS
                    ====================================================== */}

                <section className="repo-seccion">
                    <header className="repo-seccion__header">
                        <div>
                            <h2>
                                Filtros de consulta
                            </h2>

                            <p>
                                Define el período,
                                sucursales y condición
                                de distancia.
                            </p>
                        </div>
                    </header>

                    <FiltroMarcajesComponent
                        filters={
                            draftFilters
                        }
                        sucursales={
                            sucursales
                        }
                        loading={
                            loading
                        }
                        onChange={
                            setDraftFilters
                        }
                        onSearch={
                            handleSearch
                        }
                        onReset={
                            handleReset
                        }
                    />
                </section>


                {/* ======================================================
                    ERROR
                    ====================================================== */}

                {error && (
                    <div
                        className="repo-alerta repo-alerta--error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}


                {/* ======================================================
                    RESULTADOS
                    ====================================================== */}

                <section className="repo-resultados">
                    <header className="repo-resultados__header">
                        <div>
                            <h2>
                                Registros encontrados
                            </h2>

                            <p>
                                {rows.length}{" "}
                                {rows.length === 1
                                    ? "registro"
                                    : "registros"}{" "}
                                en la consulta actual.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="repo-excel"
                            onClick={
                                handleExportExcel
                            }
                            disabled={
                                rows.length === 0 ||
                                loading
                            }
                            title="Exportar reporte a Excel"
                        >
                            <img
                                src={excelIcon}
                                alt=""
                            />

                            <span>
                                {loading
                                    ? "Procesando..."
                                    : "Exportar Excel"}
                            </span>
                        </button>
                    </header>

                    <MarcajesTableComponent
                        rows={rows}
                        loading={loading}
                    />
                </section>
            </div>
        </main>
    );
}