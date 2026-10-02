import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Link,
} from "react-router-dom";

import {
    useSession,
} from "../../hooks/useSession";
import type {
    EmpleadoEquipo,
} from "../../models/empleado";
import type {
    FiltroSucursal,
} from "../../models/sucursal";
import type {
    UsuarioServicio,
} from "../../models/usuarioServicio";
import {
    api,
} from "../../services/api";
import {
    userApi,
} from "../../services/userApi";

import "../../styles/SupervisorHome.css";

// ======================================================
// HELPERS
// ======================================================

function obtenerFechaActual():
    string {
    const fecha =
        new Date();

    const year =
        fecha.getFullYear();

    const month =
        String(
            fecha.getMonth() +
                1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            fecha.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;
}

function correspondeAHoy(
    fecha:
        string |
        undefined
): boolean {
    if (!fecha) {
        return false;
    }

    return (
        fecha.slice(
            0,
            10
        ) ===
        obtenerFechaActual()
    );
}

function obtenerSaludo():
    string {
    const hora =
        new Date()
            .getHours();

    if (hora < 12) {
        return "Buenos días";
    }

    if (hora < 18) {
        return "Buenas tardes";
    }

    return "Buenas noches";
}

function obtenerFechaVisible():
    string {
    const texto =
        new Intl.DateTimeFormat(
            "es-GT",
            {
                weekday:
                    "long",

                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric",
            }
        ).format(
            new Date()
        );

    return (
        texto
            .charAt(0)
            .toUpperCase() +
        texto.slice(1)
    );
}

// ======================================================
// ICONOS
// ======================================================

function TeamIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <circle
                cx="9"
                cy="7"
                r="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />

            <path
                d="M16 3.2a4 4 0 0 1 0 7.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />

            <path
                d="M22 21v-2a4 4 0 0 0-3-3.87"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />

            <path
                d="m8.5 12 2.3 2.3 4.8-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />

            <path
                d="M12 7v5l3 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function BranchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M4 21V7l8-4 8 4v14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />

            <path
                d="M8 10h1M15 10h1M8 14h1M15 14h1M10 21v-4h4v4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function FolderIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M3 6.5A2.5 2.5 0 0 1 5.5 4H9l2 2h7.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M8 11h8M8 14h6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function MapIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />

            <circle
                cx="12"
                cy="10"
                r="2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />

            <path
                d="M16 3v4M8 3v4M3 10h18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function WarningIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M10.3 4.2 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />

            <path
                d="M12 9v4M12 17h.01"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

// ======================================================
// PÁGINA
// ======================================================

export function SupervisorHome() {
    const {
        empleado,
    } =
        useSession();

    const [
        equipo,
        setEquipo,
    ] =
        useState<
            EmpleadoEquipo[]
        >([]);

    const [
        usuarios,
        setUsuarios,
    ] =
        useState<
            UsuarioServicio[]
        >([]);

    const [
        sucursales,
        setSucursales,
    ] =
        useState<
            FiltroSucursal[]
        >([]);

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        error,
        setError,
    ] =
        useState<
            string | null
        >(null);

    // ======================================================
    // CARGA DEL DASHBOARD
    // ======================================================

    const cargarDashboard =
        useCallback(
            async () => {
                if (
                    !empleado
                        ?.id_empleado
                ) {
                    setLoading(
                        false
                    );

                    return;
                }

                setLoading(true);
                setError(null);

                try {
                    const [
                        respuestaEquipo,
                        respuestaUsuarios,
                        respuestaSucursales,
                    ] =
                        await Promise.all([
                            api.get<
                                EmpleadoEquipo[]
                            >(
                                `/empleado/findBySupervisor/${empleado.id_empleado}`
                            ),

                            userApi.get<
                                UsuarioServicio[]
                            >(
                                "/usuarios/findAllWithRolesAndApps"
                            ),

                            api.get<
                                FiltroSucursal[]
                            >(
                                "/sucursal/findByActivo/true"
                            ),
                        ]);

                    setEquipo(
                        respuestaEquipo
                            .data
                    );

                    setUsuarios(
                        respuestaUsuarios
                            .data
                    );

                    setSucursales(
                        respuestaSucursales
                            .data
                    );
                } catch (
                    errorPeticion
                ) {
                    console.error(
                        "Error cargando dashboard del supervisor",
                        errorPeticion
                    );

                    setError(
                        "No fue posible cargar el resumen del supervisor."
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            },
            [
                empleado
                    ?.id_empleado,
            ]
        );

    useEffect(() => {
        void cargarDashboard();
    }, [
        cargarDashboard,
    ]);

    // ======================================================
    // USUARIOS ACTIVOS
    // ======================================================

    const usuariosPorId =
        useMemo(
            () =>
                new Map(
                    usuarios.map(
                        (
                            usuario
                        ) => [
                            usuario
                                .id_usuario,
                            usuario,
                        ]
                    )
                ),
            [
                usuarios,
            ]
        );

    // ======================================================
    // EQUIPO ACTIVO DEL SUPERVISOR
    // ======================================================

    const equipoActivo =
        useMemo(
            () =>
                equipo.filter(
                    (
                        miembro
                    ) => {
                        const usuario =
                            usuariosPorId.get(
                                miembro
                                    .id_auth
                            );

                        return (
                            usuario
                                ?.activo ===
                                true &&
                            usuario.roles.includes(
                                "COL-PMW"
                            ) &&
                            usuario.apps.includes(
                                "PMW"
                            )
                        );
                    }
                ),
            [
                equipo,
                usuariosPorId,
            ]
        );

    // ======================================================
    // RESUMEN DEL DÍA
    // ======================================================

    const resumen =
        useMemo(() => {
            const conMarcajeHoy =
                equipoActivo.filter(
                    (
                        miembro
                    ) => {
                        const ultimo =
                            miembro
                                .marcaje_marcaje_empleadoToempleado
                                [0];

                        return (
                            ultimo &&
                            correspondeAHoy(
                                ultimo.fecha
                            )
                        );
                    }
                );

            const entradasAbiertas =
                conMarcajeHoy.filter(
                    (
                        miembro
                    ) =>
                        miembro
                            .marcaje_marcaje_empleadoToempleado
                            [0]
                            ?.es_entrada ===
                        true
                );

            return {
                totalEquipo:
                    equipoActivo.length,

                conMarcaje:
                    conMarcajeHoy.length,

                pendientes:
                    Math.max(
                        0,
                        equipoActivo.length -
                            conMarcajeHoy.length
                    ),

                entradasAbiertas:
                    entradasAbiertas.length,

                sucursales:
                    sucursales.length,
            };
        }, [
            equipoActivo,
            sucursales,
        ]);

    const tieneAlertas =
        resumen.pendientes >
            0 ||
        resumen
            .entradasAbiertas >
            0;

    const saludo =
        obtenerSaludo();

    const nombreSupervisor =
        empleado?.nombre ||
        "Supervisor";

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <main className="supervisor-home">
            <div className="supervisor-home-shell">
                {/* ======================================================
                    BIENVENIDA
                    ====================================================== */}

                <section className="supervisor-welcome">
                    <div className="supervisor-welcome-content">
                        <span className="supervisor-eyebrow">
                            Gestión de
                            asistencia
                        </span>

                        <h1>
                            {saludo},{" "}
                            {
                                nombreSupervisor
                            }
                        </h1>

                        <p>
                            Consulta el
                            estado de
                            asistencia de
                            tu equipo y
                            accede
                            rápidamente a
                            las herramientas
                            de supervisión.
                        </p>
                    </div>

                    <div className="supervisor-date-card">
                        <div className="supervisor-date-icon">
                            <CalendarIcon />
                        </div>

                        <div>
                            <span>
                                Fecha de hoy
                            </span>

                            <strong>
                                {
                                    obtenerFechaVisible()
                                }
                            </strong>
                        </div>
                    </div>
                </section>

                {/* ======================================================
                    RESUMEN
                    ====================================================== */}

                <section
                    className="supervisor-summary-section"
                    aria-labelledby="supervisor-summary-title"
                >
                    <div className="supervisor-section-header">
                        <div>
                            <h2 id="supervisor-summary-title">
                                Resumen de
                                hoy
                            </h2>

                            <p>
                                Estado actual
                                de tu equipo
                                de trabajo.
                            </p>
                        </div>

                        {!loading &&
                            !error && (
                                <span className="supervisor-live-badge">
                                    <span />

                                    Información
                                    actualizada
                                </span>
                            )}
                    </div>

                    {error && (
                        <div className="supervisor-error">
                            <div>
                                <strong>
                                    No se pudo
                                    cargar el
                                    resumen
                                </strong>

                                <span>
                                    {error}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    void cargarDashboard()
                                }
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    <div className="supervisor-summary-grid">
                        {/* ======================================================
                            MI EQUIPO
                            ====================================================== */}

                        <article className="supervisor-summary-card">
                            <div className="supervisor-summary-icon orange">
                                <TeamIcon />
                            </div>

                            <div className="supervisor-summary-content">
                                <span>
                                    Mi equipo
                                </span>

                                {loading ? (
                                    <div className="supervisor-summary-skeleton" />
                                ) : (
                                    <strong>
                                        {
                                            resumen.totalEquipo
                                        }
                                    </strong>
                                )}

                                <small>
                                    Colaboradores
                                    activos
                                    asignados
                                </small>
                            </div>
                        </article>

                        {/* ======================================================
                            CON MARCAJE
                            ====================================================== */}

                        <article className="supervisor-summary-card">
                            <div className="supervisor-summary-icon green">
                                <CheckIcon />
                            </div>

                            <div className="supervisor-summary-content">
                                <span>
                                    Con marcaje
                                    hoy
                                </span>

                                {loading ? (
                                    <div className="supervisor-summary-skeleton" />
                                ) : (
                                    <strong>
                                        {
                                            resumen.conMarcaje
                                        }
                                    </strong>
                                )}

                                <small>
                                    Colaboradores
                                    con registro
                                    del día
                                </small>
                            </div>
                        </article>

                        {/* ======================================================
                            PENDIENTES
                            ====================================================== */}

                        <article className="supervisor-summary-card">
                            <div className="supervisor-summary-icon warning">
                                <ClockIcon />
                            </div>

                            <div className="supervisor-summary-content">
                                <span>
                                    Pendientes
                                </span>

                                {loading ? (
                                    <div className="supervisor-summary-skeleton" />
                                ) : (
                                    <strong>
                                        {
                                            resumen.pendientes
                                        }
                                    </strong>
                                )}

                                <small>
                                    Sin marcaje
                                    registrado
                                    hoy
                                </small>
                            </div>
                        </article>

                        {/* ======================================================
                            SUCURSALES
                            ====================================================== */}

                        <article className="supervisor-summary-card">
                            <div className="supervisor-summary-icon blue">
                                <BranchIcon />
                            </div>

                            <div className="supervisor-summary-content">
                                <span>
                                    Sucursales
                                </span>

                                {loading ? (
                                    <div className="supervisor-summary-skeleton" />
                                ) : (
                                    <strong>
                                        {
                                            resumen.sucursales
                                        }
                                    </strong>
                                )}

                                <small>
                                    Ubicaciones
                                    activas
                                </small>
                            </div>
                        </article>
                    </div>
                </section>

                {/* ======================================================
                    ACCESOS RÁPIDOS
                    ====================================================== */}

                <section
                    className="supervisor-options"
                    aria-labelledby="supervisor-options-title"
                >
                    <div className="supervisor-section-header">
                        <div>
                            <h2 id="supervisor-options-title">
                                Accesos
                                rápidos
                            </h2>

                            <p>
                                Ingresa
                                directamente
                                a las
                                herramientas
                                principales.
                            </p>
                        </div>
                    </div>

                    <div className="supervisor-card-grid">
                        {/* ======================================================
                            EQUIPO
                            ====================================================== */}

                        <Link
                            to="/supervisor/equipo"
                            className="supervisor-card"
                        >
                            <div className="supervisor-card-icon">
                                <TeamIcon />
                            </div>

                            <div className="supervisor-card-content">
                                <h3>
                                    Equipo
                                </h3>

                                <p>
                                    Consulta los
                                    colaboradores
                                    asignados a
                                    tu supervisión
                                    y su
                                    información
                                    operativa.
                                </p>

                                <span className="supervisor-card-action">
                                    Ver equipo

                                    <span aria-hidden="true">
                                        →
                                    </span>
                                </span>
                            </div>
                        </Link>

                        {/* ======================================================
                            MARCAJES
                            ====================================================== */}

                        <Link
                            to="/supervisor/repositorio-marcajes"
                            className="supervisor-card"
                        >
                            <div className="supervisor-card-icon">
                                <FolderIcon />
                            </div>

                            <div className="supervisor-card-content">
                                <h3>
                                    Repositorio
                                    de marcajes
                                </h3>

                                <p>
                                    Consulta,
                                    filtra y
                                    descarga los
                                    registros de
                                    asistencia de
                                    los
                                    colaboradores.
                                </p>

                                <span className="supervisor-card-action">
                                    Abrir
                                    repositorio

                                    <span aria-hidden="true">
                                        →
                                    </span>
                                </span>
                            </div>
                        </Link>

                        {/* ======================================================
                            SUCURSALES
                            ====================================================== */}

                        <Link
                            to="/supervisor/sucursales"
                            className="supervisor-card"
                        >
                            <div className="supervisor-card-icon">
                                <MapIcon />
                            </div>

                            <div className="supervisor-card-content">
                                <h3>
                                    Sucursales
                                </h3>

                                <p>
                                    Consulta y
                                    administra las
                                    ubicaciones
                                    habilitadas
                                    para realizar
                                    marcajes.
                                </p>

                                <span className="supervisor-card-action">
                                    Ver
                                    sucursales

                                    <span aria-hidden="true">
                                        →
                                    </span>
                                </span>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* ======================================================
                    ATENCIÓN REQUERIDA
                    ====================================================== */}

                <section
                    className="supervisor-attention-section"
                    aria-labelledby="supervisor-attention-title"
                >
                    <div className="supervisor-section-header">
                        <div>
                            <h2 id="supervisor-attention-title">
                                Atención
                                requerida
                            </h2>

                            <p>
                                Situaciones que
                                pueden requerir
                                revisión durante
                                el día.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="supervisor-attention-card loading">
                            <div className="supervisor-attention-skeleton" />
                        </div>
                    ) : !tieneAlertas ? (
                        <div className="supervisor-attention-card success">
                            <div className="supervisor-attention-icon">
                                <CheckIcon />
                            </div>

                            <div className="supervisor-attention-text">
                                <strong>
                                    Sin alertas
                                    pendientes
                                </strong>

                                <span>
                                    No hay
                                    situaciones
                                    operativas
                                    que requieran
                                    atención en
                                    este momento.
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="supervisor-attention-list">
                            {resumen.pendientes >
                                0 && (
                                <Link
                                    to="/supervisor/equipo"
                                    className="supervisor-attention-card warning"
                                >
                                    <div className="supervisor-attention-icon">
                                        <WarningIcon />
                                    </div>

                                    <div className="supervisor-attention-text">
                                        <strong>
                                            {
                                                resumen.pendientes
                                            }{" "}
                                            {resumen.pendientes ===
                                            1
                                                ? "colaborador aún no registra marcaje"
                                                : "colaboradores aún no registran marcaje"}
                                        </strong>

                                        <span>
                                            Revisa
                                            el
                                            estado
                                            de tu
                                            equipo.
                                        </span>
                                    </div>

                                    <span className="supervisor-attention-action">
                                        Ver
                                        equipo
                                        →
                                    </span>
                                </Link>
                            )}

                            {resumen
                                .entradasAbiertas >
                                0 && (
                                <Link
                                    to="/supervisor/repositorio-marcajes"
                                    className="supervisor-attention-card info"
                                >
                                    <div className="supervisor-attention-icon">
                                        <ClockIcon />
                                    </div>

                                    <div className="supervisor-attention-text">
                                        <strong>
                                            {
                                                resumen.entradasAbiertas
                                            }{" "}
                                            {resumen.entradasAbiertas ===
                                            1
                                                ? "entrada continúa sin salida registrada"
                                                : "entradas continúan sin salida registrada"}
                                        </strong>

                                        <span>
                                            Consulta
                                            los
                                            marcajes
                                            registrados
                                            hoy.
                                        </span>
                                    </div>

                                    <span className="supervisor-attention-action">
                                        Revisar
                                        marcajes
                                        →
                                    </span>
                                </Link>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}