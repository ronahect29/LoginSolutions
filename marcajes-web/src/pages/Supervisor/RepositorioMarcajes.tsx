import { useEffect, useState } from "react";
import type { FiltrosMarcajes, MarcajeReporteDto } from "../../models/marcaje";
import { api } from "../../services/api";
import "../../styles/RepositorioMarcajes.css";
import type { FiltroSucursal } from "../../models/sucursal";
import { FiltroMarcajesComponent } from "./components/FiltroMarcajesComponent";
import { MarcajesTableComponent } from "./components/MarcajesTableComponent";
import excelIcon from "../../assets/excel_icon.png";
const initialFilters: FiltrosMarcajes = {
    fechaDesde: null,
    fechaHasta: null,
    sucursales: null,
    fueraDeRango: null,
    jefeId: null,
    empleadoId: null
};

export function RepositorioMarcajes() {
    const [rows, setRows] = useState<MarcajeReporteDto[]>([]);
    const [draftFilters, setDraftFilters] = useState<FiltrosMarcajes>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<FiltrosMarcajes>(initialFilters);
    const [sucursales, setSucursales] = useState<FiltroSucursal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        api.get<FiltroSucursal[]>("/sucursal/findByActivo/true")
            .then(res => { setSucursales(res.data) })
            .catch(err => {
                console.error("Error cargando sucursales", err);
            });
    }, []);
    async function fetchMarcajes(filters: FiltrosMarcajes) {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post<MarcajeReporteDto[]>(
                "/marcaje/findByFilters",
                filters
            );
            setRows(res.data);
        } catch (err) {
            console.error("Error cargando marcajes", err);
            setError("No se pudo generar el reporte");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchMarcajes(initialFilters);
    }, []);

    function handleSearch() {
        setAppliedFilters(draftFilters);
        fetchMarcajes(draftFilters);
    }

    function handleReset() {
        setDraftFilters(initialFilters);
        setAppliedFilters(initialFilters);
        fetchMarcajes(initialFilters);
    }
    async function handleExportExcel() {
        try {
            setLoading(true);
            const res = await api.post("/marcaje/MarcajesReporteExcel",
                appliedFilters,
                {
                    responseType: "blob"
                }
            );
            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte_marcajes_${Date.now()}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error exportando Excel: ", err);
            setError("No se pudo exportar el reporte")
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="marcajes-page">
            <h1>Reporte de Marcajes</h1>

            <FiltroMarcajesComponent
                filters={draftFilters}
                sucursales={sucursales}
                onChange={setDraftFilters}
                onSearch={handleSearch}
                onReset={handleReset}
            />
            <div className="repo-actions">
                <button
                    className="btn-excel"
                    onClick={handleExportExcel}
                    disabled={rows.length === 0 || loading}
                    title="Exportar reporte a Excel"
                >
                    <img src={excelIcon} alt="Excel" />
                    <span>{loading ? "Exportando..." : "Exportar Excel"}</span>
                </button>
            </div>
            {loading && <p>Cargando reporte...</p>}
            {error && <p className="error">{error}</p>}

            <MarcajesTableComponent rows={rows} loading={loading} />
        </div>
    );
}
