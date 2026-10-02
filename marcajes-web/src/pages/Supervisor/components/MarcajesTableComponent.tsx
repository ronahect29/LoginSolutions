import type {
    MarcajeReporteDto
} from "../../../models/marcaje";


interface Props {
    rows:
        MarcajeReporteDto[];

    loading:
        boolean;
}


// ======================================================
// ICONOS
// ======================================================

function MapIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />

            <circle
                cx="12"
                cy="10"
                r="2.5"
            />
        </svg>
    );
}


// ======================================================
// HELPERS
// ======================================================

function formatFechaLocal(
    input: string | Date
): string {
    const iso =
        input instanceof Date
            ? input.toISOString()
            : input;

    const [
        year,
        month,
        day
    ] = iso
        .slice(0, 10)
        .split("-");

    if (
        !year ||
        !month ||
        !day
    ) {
        return String(
            input
        );
    }

    return `${day}/${month}/${year}`;
}


function getDistanciaClass(
    distancia?: number
): string {
    if (
        distancia == null ||
        distancia === 0
    ) {
        return "repo-distancia repo-distancia--sin-datos";
    }

    if (
        distancia <= 5
    ) {
        return "repo-distancia repo-distancia--ok";
    }

    return "repo-distancia repo-distancia--alerta";
}


function getDistanciaLabel(
    distancia?: number
): string {
    if (
        distancia == null ||
        distancia === 0
    ) {
        return "Sin distancia";
    }

    if (
        distancia <= 5
    ) {
        return "En rango";
    }

    return `${distancia} m`;
}


// ======================================================
// COMPONENTE
// ======================================================

export function MarcajesTableComponent({
    rows,
    loading
}: Props) {
    if (loading) {
        return (
            <div className="repo-tabla-estado">
                <span className="repo-tabla-loader" />

                <strong>
                    Cargando marcajes
                </strong>

                <p>
                    Consultando los registros
                    disponibles.
                </p>
            </div>
        );
    }


    if (
        rows.length === 0
    ) {
        return (
            <div className="repo-tabla-estado">
                <strong>
                    Sin registros
                </strong>

                <p>
                    No existen marcajes que
                    coincidan con los filtros
                    seleccionados.
                </p>
            </div>
        );
    }


    return (
        <div className="repo-tabla-contenedor">
            <table className="repo-tabla">
                <thead>
                    <tr>
                        <th>
                            Motorista
                        </th>

                        <th>
                            Fecha
                        </th>

                        <th>
                            Entrada
                        </th>

                        <th>
                            Salida
                        </th>

                        <th>
                            Tiempo total
                        </th>

                        <th>
                            Sucursal
                        </th>

                        <th>
                            Ubicación sucursal
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map(
                        (row) => (
                            <tr
                                key={
                                    row.id_marcaje
                                }
                            >

                                {/* ======================================================
                                    MOTORISTA
                                    ====================================================== */}

                                <td>
                                    <div className="repo-empleado">
                                        <strong>
                                            {
                                                row.empleado_nombre
                                            }
                                        </strong>

                                        <span>
                                            {
                                                row.empleado_correo
                                            }
                                        </span>
                                    </div>
                                </td>


                                {/* ======================================================
                                    FECHA
                                    ====================================================== */}

                                <td>
                                    <span className="repo-fecha">
                                        {formatFechaLocal(
                                            row.fecha
                                        )}
                                    </span>
                                </td>


                                {/* ======================================================
                                    ENTRADA
                                    ====================================================== */}

                                <td>
                                    <div className="repo-marcaje-celda">
                                        <strong>
                                            {row.hora_entrada ??
                                                "—"}
                                        </strong>

                                        <div className="repo-marcaje-celda__detalle">
                                            {row.ubicacion_entrada ? (
                                                <a
                                                    href={
                                                        row.ubicacion_entrada
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="repo-mapa"
                                                >
                                                    <MapIcon />

                                                    Mapa
                                                </a>
                                            ) : (
                                                <span className="repo-sin-mapa">
                                                    Sin ubicación
                                                </span>
                                            )}

                                            {row.hora_entrada && (
                                                <span
                                                    className={
                                                        getDistanciaClass(
                                                            row.distancia_entrada
                                                        )
                                                    }
                                                >
                                                    {getDistanciaLabel(
                                                        row.distancia_entrada
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>


                                {/* ======================================================
                                    SALIDA
                                    ====================================================== */}

                                <td>
                                    <div className="repo-marcaje-celda">
                                        <strong>
                                            {row.hora_salida ??
                                                "—"}
                                        </strong>

                                        <div className="repo-marcaje-celda__detalle">
                                            {row.ubicacion_salida ? (
                                                <a
                                                    href={
                                                        row.ubicacion_salida
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="repo-mapa"
                                                >
                                                    <MapIcon />

                                                    Mapa
                                                </a>
                                            ) : (
                                                <span className="repo-sin-mapa">
                                                    Sin ubicación
                                                </span>
                                            )}

                                            {row.hora_salida && (
                                                <span
                                                    className={
                                                        getDistanciaClass(
                                                            row.distancia_salida
                                                        )
                                                    }
                                                >
                                                    {getDistanciaLabel(
                                                        row.distancia_salida
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>


                                {/* ======================================================
                                    TOTAL
                                    ====================================================== */}

                                <td>
                                    {row.horas_trabajadas ? (
                                        <span className="repo-tiempo">
                                            {
                                                row.horas_trabajadas
                                            }
                                        </span>
                                    ) : (
                                        <span className="repo-sin-datos">
                                            Pendiente
                                        </span>
                                    )}
                                </td>


                                {/* ======================================================
                                    SUCURSAL
                                    ====================================================== */}

                                <td>
                                    {row.sucursal_nombre ? (
                                        <span className="repo-sucursal">
                                            {
                                                row.sucursal_nombre
                                            }
                                        </span>
                                    ) : (
                                        <span className="repo-sin-datos">
                                            Sin asignar
                                        </span>
                                    )}
                                </td>


                                {/* ======================================================
                                    MAPA SUCURSAL
                                    ====================================================== */}

                                <td>
                                    {row.sucursal_ubicacion ? (
                                        <a
                                            href={
                                                row.sucursal_ubicacion
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="repo-mapa repo-mapa--sucursal"
                                        >
                                            <MapIcon />

                                            Ver sucursal
                                        </a>
                                    ) : (
                                        <span className="repo-sin-datos">
                                            No disponible
                                        </span>
                                    )}
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}