import type { MarcajeReporteDto } from "../../../models/marcaje";

interface Props {
    rows: MarcajeReporteDto[];
    loading: boolean;
}

export function MarcajesTableComponent({ rows, loading }: Props) {

    if (loading) {
        return <p className="repo-loading">Cargando reporte...</p>;
    }

    if (!loading && rows.length === 0) {
        return <p className="repo-empty">No hay datos para mostrar</p>;
    }

    function getDistanciaStyle(distancia?: number) {
        if (!distancia) return { color: "#6b7280" };
        if (distancia <= 5) return { color: "#16a34a", fontWeight: 600 };
        return { color: "#dc2626", fontWeight: 700 };
    }

    function getDistanciaLabel(distancia?: number) {
        if (!distancia) return "-";
        return distancia <= 5 ? "En rango" : `⚠️ ${distancia} m`;
    }
    function formatFechaLocal(input: string | Date): string {
        const iso =
            input instanceof Date
                ? input.toISOString()
                : input;

        const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
        return `${d}/${m}/${y}`;
    }

    return (
        <table className="marcajes-table">
            <thead>
                <tr>
                    <th>Empleado</th>
                    <th>Correo</th>
                    <th>Fecha</th>
                    <th>Entrada</th>
                    <th>Salida</th>
                    <th>Total</th>
                    <th>Ubicación Entrada</th>
                    <th>Alerta Entrada</th>
                    <th>Ubicación Salida</th>
                    <th>Alerta Salida</th>
                    <th>Sucursal</th>
                    <th>Ubicación Sucursal</th>
                </tr>
            </thead>
            <tbody>
                {rows.map(r => (
                    <tr key={r.id_marcaje}>
                        <td>{r.empleado_nombre}</td>
                        <td>{r.empleado_correo}</td>
                        <td>{formatFechaLocal(r.fecha)}</td>
                        <td>{r.hora_entrada ?? "-"}</td>
                        <td>{r.hora_salida ?? "-"}</td>
                        <td>{r.horas_trabajadas ?? "-"}</td>

                        <td>
                            {r.ubicacion_entrada
                                ? <a href={r.ubicacion_entrada} target="_blank" className="repo-link">Ver mapa 🗺️</a>
                                : "-"
                            }
                        </td>
                        <td style={getDistanciaStyle(r.distancia_entrada)}>
                            {getDistanciaLabel(r.distancia_entrada)}
                        </td>

                        <td>
                            {r.ubicacion_salida
                                ? <a href={r.ubicacion_salida} target="_blank" className="repo-link">Ver mapa 🗺️</a>
                                : "-"
                            }
                        </td>
                        <td style={getDistanciaStyle(r.distancia_salida)}>
                            {getDistanciaLabel(r.distancia_salida)}
                        </td>

                        <td>{r.sucursal_nombre ?? "-"}</td>
                        <td>
                            {r.sucursal_ubicacion
                                ? <a href={r.sucursal_ubicacion} target="_blank" className="repo-link">Ver mapa 🗺️</a>
                                : "-"
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}