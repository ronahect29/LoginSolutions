import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type FormEvent
} from "react";

import axios from "axios";

import { api } from "../../services/api";
import { userApi } from "../../services/userApi";
import { useSession } from "../../hooks/useSession";

import type {
    EmpleadoEquipo,
    FormularioEmpleadoEquipo,
    RespuestaActualizacionEmpleado
} from "../../models/empleado";

import type {
    FiltroSucursal
} from "../../models/sucursal";

import type {
    UsuarioServicio
} from "../../models/usuarioServicio";

import "../../styles/EquipoPage.css";


const formularioInicial: FormularioEmpleadoEquipo = {
    direccion: "",
    telefono: "",
    sucursal: "",
    jefe: ""
};


// ======================================================
// ICONOS
// ======================================================

function UsersIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
            <path d="M8 10h2" />
            <path d="M14 10h2" />
            <path d="M8 13h2" />
            <path d="M14 13h2" />
        </svg>
    );
}


function SupervisorIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
            <path d="m16.5 13.5 1.5 1.5 3-3" />
        </svg>
    );
}


function WarningIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    );
}


function RefreshIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <path d="M20 6v6h-6" />
            <path d="M4 18v-6h6" />
            <path d="M5.1 9a8 8 0 0 1 13.2-3L20 8" />
            <path d="M18.9 15a8 8 0 0 1-13.2 3L4 16" />
        </svg>
    );
}


function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </svg>
    );
}


function EditIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
    );
}


// ======================================================
// HELPERS
// ======================================================

function obtenerMensajeError(
    error: unknown
): string {
    if (
        axios.isAxiosError<{
            message?: string;
        }>(error)
    ) {
        return (
            error.response?.data?.message ||
            "No fue posible completar la operación."
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Ocurrió un error inesperado.";
}


function obtenerIniciales(
    nombre: string
): string {
    return nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            (palabra) =>
                palabra.charAt(0).toUpperCase()
        )
        .join("");
}


function formatearFecha(
    fecha: string
): string {
    const valor = new Date(fecha);

    if (
        Number.isNaN(
            valor.getTime()
        )
    ) {
        return fecha;
    }

    return valor.toLocaleDateString(
        "es-GT",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


// ======================================================
// COMPONENTE
// ======================================================

export function EquipoPage() {
    const {
        empleado: empleadoSesion
    } = useSession();


    // ======================================================
    // ESTADOS
    // ======================================================

    const [
        empleados,
        setEmpleados
    ] = useState<EmpleadoEquipo[]>([]);

    const [
        usuariosServicio,
        setUsuariosServicio
    ] = useState<UsuarioServicio[]>([]);

    const [
        sucursales,
        setSucursales
    ] = useState<FiltroSucursal[]>([]);

    const [
        cargando,
        setCargando
    ] = useState(true);

    const [
        guardando,
        setGuardando
    ] = useState(false);

    const [
        busqueda,
        setBusqueda
    ] = useState("");

    const [
        filtroSucursal,
        setFiltroSucursal
    ] = useState("todas");

    const [
        filtroSupervisor,
        setFiltroSupervisor
    ] = useState("todos");

    const [
        empleadoSeleccionado,
        setEmpleadoSeleccionado
    ] = useState<EmpleadoEquipo | null>(
        null
    );

    const [
        formulario,
        setFormulario
    ] = useState<FormularioEmpleadoEquipo>(
        formularioInicial
    );

    const [
        mensaje,
        setMensaje
    ] = useState<string | null>(
        null
    );

    const [
        error,
        setError
    ] = useState<string | null>(
        null
    );


    // ======================================================
    // CARGA DE INFORMACIÓN
    // ======================================================

    const cargarInformacion =
        useCallback(
            async () => {
                setCargando(true);
                setError(null);

                try {
                    const [
                        respuestaEmpleados,
                        respuestaSucursales,
                        respuestaUsuarios
                    ] = await Promise.all([
                        api.get<EmpleadoEquipo[]>(
                            "/empleado/findAll"
                        ),

                        api.get<FiltroSucursal[]>(
                            "/sucursal/findByActivo/true"
                        ),

                        userApi.get<UsuarioServicio[]>(
                            "/usuarios/findAllWithRolesAndApps"
                        )
                    ]);

                    setEmpleados(
                        respuestaEmpleados.data
                    );

                    setSucursales(
                        respuestaSucursales.data
                    );

                    setUsuariosServicio(
                        respuestaUsuarios.data
                    );
                } catch (
                    errorPeticion
                ) {
                    setError(
                        obtenerMensajeError(
                            errorPeticion
                        )
                    );
                } finally {
                    setCargando(false);
                }
            },
            []
        );


    useEffect(
        () => {
            void cargarInformacion();
        },
        [cargarInformacion]
    );


    // ======================================================
    // CLASIFICACIÓN DE USUARIOS
    // ======================================================

    const usuariosPorId =
        useMemo(
            () =>
                new Map(
                    usuariosServicio.map(
                        (usuario) => [
                            usuario.id_usuario,
                            usuario
                        ]
                    )
                ),
            [usuariosServicio]
        );


    const motoristas =
        useMemo(
            () =>
                empleados
                    .filter(
                        (empleado) => {
                            const usuario =
                                usuariosPorId.get(
                                    empleado.id_auth
                                );

                            return (
                                usuario?.activo ===
                                    true &&
                                usuario.roles.includes(
                                    "COL-PMW"
                                )
                            );
                        }
                    )
                    .sort(
                        (a, b) =>
                            a.nombre.localeCompare(
                                b.nombre,
                                "es"
                            )
                    ),
            [
                empleados,
                usuariosPorId
            ]
        );


    const supervisores =
        useMemo(
            () =>
                empleados
                    .filter(
                        (empleado) => {
                            const usuario =
                                usuariosPorId.get(
                                    empleado.id_auth
                                );

                            return (
                                usuario?.activo ===
                                    true &&
                                usuario.roles.includes(
                                    "SUP-PMW"
                                )
                            );
                        }
                    )
                    .sort(
                        (a, b) =>
                            a.nombre.localeCompare(
                                b.nombre,
                                "es"
                            )
                    ),
            [
                empleados,
                usuariosPorId
            ]
        );


    const idsSupervisoresActivos =
        useMemo(
            () =>
                new Set(
                    supervisores.map(
                        (supervisor) =>
                            supervisor.id_empleado
                    )
                ),
            [supervisores]
        );


    // ======================================================
    // RESUMEN
    // ======================================================

    const resumen =
        useMemo(
            () => {
                const conSucursal =
                    motoristas.filter(
                        (empleado) =>
                            empleado.sucursal !==
                            null
                    ).length;

                const sinSucursal =
                    motoristas.length -
                    conSucursal;

                const sinSupervisor =
                    motoristas.filter(
                        (empleado) =>
                            empleado.jefe ===
                                null ||
                            !idsSupervisoresActivos.has(
                                empleado.jefe
                            )
                    ).length;

                return {
                    total:
                        motoristas.length,
                    conSucursal,
                    sinSucursal,
                    sinSupervisor
                };
            },
            [
                motoristas,
                idsSupervisoresActivos
            ]
        );


    // ======================================================
    // DISTRIBUCIÓN
    // ======================================================

    const conteoPorSupervisor =
        useMemo(
            () => {
                const resultados =
                    supervisores.map(
                        (supervisor) => ({
                            id:
                                supervisor.id_empleado,

                            nombre:
                                supervisor.nombre,

                            cantidad:
                                motoristas.filter(
                                    (motorista) =>
                                        motorista.jefe ===
                                        supervisor.id_empleado
                                ).length
                        })
                    );

                const sinSupervisor =
                    motoristas.filter(
                        (motorista) =>
                            motorista.jefe ===
                                null ||
                            !idsSupervisoresActivos.has(
                                motorista.jefe
                            )
                    ).length;

                return {
                    supervisores:
                        resultados,
                    sinSupervisor
                };
            },
            [
                supervisores,
                motoristas,
                idsSupervisoresActivos
            ]
        );


    const conteoPorSucursal =
        useMemo(
            () => {
                const resultados =
                    sucursales
                        .map(
                            (sucursal) => ({
                                id:
                                    sucursal.id_sucursal,

                                nombre:
                                    sucursal.nombre,

                                cantidad:
                                    motoristas.filter(
                                        (motorista) =>
                                            motorista.sucursal ===
                                            sucursal.id_sucursal
                                    ).length
                            })
                        )
                        .sort(
                            (a, b) =>
                                a.nombre.localeCompare(
                                    b.nombre,
                                    "es"
                                )
                        );

                const sinSucursal =
                    motoristas.filter(
                        (motorista) =>
                            motorista.sucursal ===
                            null
                    ).length;

                return {
                    sucursales:
                        resultados,
                    sinSucursal
                };
            },
            [
                sucursales,
                motoristas
            ]
        );


    // ======================================================
    // FILTRADO
    // ======================================================

    const empleadosFiltrados =
        useMemo(
            () => {
                const texto =
                    busqueda
                        .trim()
                        .toLowerCase();

                return motoristas.filter(
                    (empleado) => {
                        const sucursalAsignada =
                            empleado
                                .sucursal_empleado_sucursalTosucursal
                                ?.nombre ?? "";

                        const supervisorAsignado =
                            empleado.empleado
                                ?.nombre ?? "";

                        const coincideBusqueda =
                            !texto ||
                            empleado.nombre
                                .toLowerCase()
                                .includes(
                                    texto
                                ) ||
                            empleado.correo
                                .toLowerCase()
                                .includes(
                                    texto
                                ) ||
                            empleado.username
                                .toLowerCase()
                                .includes(
                                    texto
                                ) ||
                            empleado.telefono
                                ?.toLowerCase()
                                .includes(
                                    texto
                                ) ||
                            sucursalAsignada
                                .toLowerCase()
                                .includes(
                                    texto
                                ) ||
                            supervisorAsignado
                                .toLowerCase()
                                .includes(
                                    texto
                                );

                        const coincideSucursal =
                            filtroSucursal ===
                                "todas" ||
                            (
                                filtroSucursal ===
                                    "sin-sucursal" &&
                                empleado.sucursal ===
                                    null
                            ) ||
                            empleado.sucursal ===
                                Number(
                                    filtroSucursal
                                );

                        const sinSupervisorValido =
                            empleado.jefe ===
                                null ||
                            !idsSupervisoresActivos.has(
                                empleado.jefe
                            );

                        const coincideSupervisor =
                            filtroSupervisor ===
                                "todos" ||
                            (
                                filtroSupervisor ===
                                    "sin-supervisor" &&
                                sinSupervisorValido
                            ) ||
                            empleado.jefe ===
                                Number(
                                    filtroSupervisor
                                );

                        return (
                            coincideBusqueda &&
                            coincideSucursal &&
                            coincideSupervisor
                        );
                    }
                );
            },
            [
                motoristas,
                busqueda,
                filtroSucursal,
                filtroSupervisor,
                idsSupervisoresActivos
            ]
        );


    const hayFiltros =
        Boolean(
            busqueda ||
            filtroSucursal !==
                "todas" ||
            filtroSupervisor !==
                "todos"
        );


    // ======================================================
    // SUPERVISORES DISPONIBLES
    // ======================================================

    const supervisoresDisponibles =
        useMemo(
            () =>
                supervisores.filter(
                    (supervisor) =>
                        supervisor.id_empleado !==
                        empleadoSeleccionado
                            ?.id_empleado
                ),
            [
                supervisores,
                empleadoSeleccionado
                    ?.id_empleado
            ]
        );


    // ======================================================
    // FORMULARIO
    // ======================================================

    function abrirFormulario(
        empleado: EmpleadoEquipo
    ) {
        setEmpleadoSeleccionado(
            empleado
        );

        setMensaje(null);
        setError(null);

        const idSupervisorSesion =
            empleadoSesion?.id_empleado;

        const supervisorPredeterminado =
            empleado.jefe !== null
                ? empleado.jefe
                : idSupervisorSesion &&
                    idsSupervisoresActivos.has(
                        idSupervisorSesion
                    )
                    ? idSupervisorSesion
                    : null;

        setFormulario({
            direccion:
                empleado.direccion ?? "",

            telefono:
                empleado.telefono ?? "",

            sucursal:
                empleado.sucursal !== null
                    ? String(
                        empleado.sucursal
                    )
                    : "",

            jefe:
                supervisorPredeterminado !==
                null
                    ? String(
                        supervisorPredeterminado
                    )
                    : ""
        });
    }


    function cerrarFormulario() {
        if (guardando) {
            return;
        }

        setEmpleadoSeleccionado(
            null
        );

        setFormulario(
            formularioInicial
        );
    }


    function actualizarFormulario(
        campo:
            keyof FormularioEmpleadoEquipo,
        valor: string
    ) {
        setFormulario(
            (formularioActual) => ({
                ...formularioActual,
                [campo]: valor
            })
        );
    }


    function limpiarFiltros() {
        setBusqueda("");
        setFiltroSucursal(
            "todas"
        );
        setFiltroSupervisor(
            "todos"
        );
    }


    async function guardarCambios(
        evento:
            FormEvent<HTMLFormElement>
    ) {
        evento.preventDefault();

        if (!empleadoSeleccionado) {
            return;
        }

        setGuardando(true);
        setMensaje(null);
        setError(null);

        try {
            const respuesta =
                await api.put<RespuestaActualizacionEmpleado>(
                    `/empleado/updateOperational/${empleadoSeleccionado.id_empleado}`,
                    {
                        direccion:
                            formulario.direccion
                                .trim() ||
                            null,

                        telefono:
                            formulario.telefono
                                .trim() ||
                            null,

                        sucursal:
                            formulario.sucursal
                                ? Number(
                                    formulario.sucursal
                                )
                                : null,

                        jefe:
                            formulario.jefe
                                ? Number(
                                    formulario.jefe
                                )
                                : null
                    }
                );

            setEmpleados(
                (
                    empleadosActuales
                ) =>
                    empleadosActuales.map(
                        (empleado) =>
                            empleado.id_empleado ===
                            respuesta.data
                                .empleado
                                .id_empleado
                                ? respuesta.data
                                    .empleado
                                : empleado
                    )
            );

            setMensaje(
                respuesta.data.message
            );

            setEmpleadoSeleccionado(
                null
            );

            setFormulario(
                formularioInicial
            );
        } catch (
            errorPeticion
        ) {
            setError(
                obtenerMensajeError(
                    errorPeticion
                )
            );
        } finally {
            setGuardando(false);
        }
    }


    // ======================================================
    // VISTA
    // ======================================================

    return (
        <main className="equipo-page">
            <div className="equipo-page__shell">

                {/* ======================================================
                    ENCABEZADO
                    ====================================================== */}

                <section className="equipo-page__encabezado">
                    <div className="equipo-page__encabezado-texto">
                        <span className="equipo-page__eyebrow">
                            Gestión operativa
                        </span>

                        <h1>
                            Equipo de motoristas
                        </h1>

                        <p>
                            Consulta y administra la distribución
                            de los motoristas por supervisor y
                            sucursal.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="equipo-page__boton-actualizar"
                        onClick={() =>
                            void cargarInformacion()
                        }
                        disabled={cargando}
                    >
                        <RefreshIcon />

                        <span>
                            {cargando
                                ? "Actualizando..."
                                : "Actualizar datos"}
                        </span>
                    </button>
                </section>


                {/* ======================================================
                    ALERTAS
                    ====================================================== */}

                {mensaje && (
                    <div
                        className="equipo-page__alerta equipo-page__alerta--exito"
                        role="status"
                    >
                        {mensaje}
                    </div>
                )}

                {error && (
                    <div
                        className="equipo-page__alerta equipo-page__alerta--error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}


                {/* ======================================================
                    RESUMEN
                    ====================================================== */}

                <section className="equipo-page__resumen">
                    <article className="equipo-page__kpi">
                        <span className="equipo-page__kpi-icono equipo-page__kpi-icono--principal">
                            <UsersIcon />
                        </span>

                        <div>
                            <span className="equipo-page__kpi-label">
                                Total de motoristas
                            </span>

                            <strong>
                                {resumen.total}
                            </strong>
                        </div>
                    </article>

                    <article className="equipo-page__kpi">
                        <span className="equipo-page__kpi-icono equipo-page__kpi-icono--exito">
                            <BranchIcon />
                        </span>

                        <div>
                            <span className="equipo-page__kpi-label">
                                Con sucursal
                            </span>

                            <strong>
                                {resumen.conSucursal}
                            </strong>
                        </div>
                    </article>

                    <article className="equipo-page__kpi">
                        <span className="equipo-page__kpi-icono equipo-page__kpi-icono--advertencia">
                            <WarningIcon />
                        </span>

                        <div>
                            <span className="equipo-page__kpi-label">
                                Sin sucursal
                            </span>

                            <strong>
                                {resumen.sinSucursal}
                            </strong>
                        </div>
                    </article>

                    <article className="equipo-page__kpi">
                        <span className="equipo-page__kpi-icono equipo-page__kpi-icono--advertencia">
                            <SupervisorIcon />
                        </span>

                        <div>
                            <span className="equipo-page__kpi-label">
                                Sin supervisor
                            </span>

                            <strong>
                                {resumen.sinSupervisor}
                            </strong>
                        </div>
                    </article>
                </section>


                {/* ======================================================
                    DISTRIBUCIÓN
                    ====================================================== */}

                <section className="equipo-page__seccion">
                    <div className="equipo-page__seccion-titulo">
                        <div>
                            <h2>
                                Distribución del equipo
                            </h2>

                            <p>
                                Selecciona una opción para
                                filtrar directamente el personal.
                            </p>
                        </div>
                    </div>

                    <div className="equipo-page__distribuciones">
                        <article className="equipo-page__distribucion">
                            <header className="equipo-page__distribucion-header">
                                <span className="equipo-page__distribucion-icono">
                                    <SupervisorIcon />
                                </span>

                                <div>
                                    <h3>
                                        Por supervisor
                                    </h3>

                                    <p>
                                        Motoristas asignados
                                    </p>
                                </div>
                            </header>

                            <div className="equipo-page__distribucion-lista">
                                {conteoPorSupervisor
                                    .supervisores
                                    .map(
                                        (
                                            supervisor
                                        ) => (
                                            <button
                                                key={
                                                    supervisor.id
                                                }
                                                type="button"
                                                className={`equipo-page__distribucion-item ${
                                                    filtroSupervisor ===
                                                    String(
                                                        supervisor.id
                                                    )
                                                        ? "equipo-page__distribucion-item--activo"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setFiltroSupervisor(
                                                        String(
                                                            supervisor.id
                                                        )
                                                    )
                                                }
                                            >
                                                <span>
                                                    {
                                                        supervisor.nombre
                                                    }
                                                </span>

                                                <strong>
                                                    {
                                                        supervisor.cantidad
                                                    }
                                                </strong>
                                            </button>
                                        )
                                    )}

                                <button
                                    type="button"
                                    className={`equipo-page__distribucion-item equipo-page__distribucion-item--pendiente ${
                                        filtroSupervisor ===
                                        "sin-supervisor"
                                            ? "equipo-page__distribucion-item--activo"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setFiltroSupervisor(
                                            "sin-supervisor"
                                        )
                                    }
                                >
                                    <span>
                                        Sin supervisor
                                    </span>

                                    <strong>
                                        {
                                            conteoPorSupervisor
                                                .sinSupervisor
                                        }
                                    </strong>
                                </button>
                            </div>
                        </article>


                        <article className="equipo-page__distribucion">
                            <header className="equipo-page__distribucion-header">
                                <span className="equipo-page__distribucion-icono">
                                    <BranchIcon />
                                </span>

                                <div>
                                    <h3>
                                        Por sucursal
                                    </h3>

                                    <p>
                                        Distribución operativa
                                    </p>
                                </div>
                            </header>

                            <div className="equipo-page__distribucion-lista">
                                {conteoPorSucursal
                                    .sucursales
                                    .map(
                                        (
                                            sucursal
                                        ) => (
                                            <button
                                                key={
                                                    sucursal.id
                                                }
                                                type="button"
                                                className={`equipo-page__distribucion-item ${
                                                    filtroSucursal ===
                                                    String(
                                                        sucursal.id
                                                    )
                                                        ? "equipo-page__distribucion-item--activo"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setFiltroSucursal(
                                                        String(
                                                            sucursal.id
                                                        )
                                                    )
                                                }
                                            >
                                                <span>
                                                    {
                                                        sucursal.nombre
                                                    }
                                                </span>

                                                <strong>
                                                    {
                                                        sucursal.cantidad
                                                    }
                                                </strong>
                                            </button>
                                        )
                                    )}

                                <button
                                    type="button"
                                    className={`equipo-page__distribucion-item equipo-page__distribucion-item--pendiente ${
                                        filtroSucursal ===
                                        "sin-sucursal"
                                            ? "equipo-page__distribucion-item--activo"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setFiltroSucursal(
                                            "sin-sucursal"
                                        )
                                    }
                                >
                                    <span>
                                        Sin sucursal
                                    </span>

                                    <strong>
                                        {
                                            conteoPorSucursal
                                                .sinSucursal
                                        }
                                    </strong>
                                </button>
                            </div>
                        </article>
                    </div>
                </section>


                {/* ======================================================
                    PERSONAL OPERATIVO
                    ====================================================== */}

                <section className="equipo-page__personal">
                    <header className="equipo-page__personal-header">
                        <div>
                            <h2>
                                Personal operativo
                            </h2>

                            <p>
                                Consulta los datos actuales y
                                administra las asignaciones.
                            </p>
                        </div>

                        <span className="equipo-page__contador">
                            {empleadosFiltrados.length} de{" "}
                            {motoristas.length}
                        </span>
                    </header>


                    {/* ======================================================
                        FILTROS
                        ====================================================== */}

                    <div className="equipo-page__filtros">
                        <div className="equipo-page__busqueda">
                            <SearchIcon />

                            <input
                                id="busqueda-equipo"
                                type="search"
                                value={busqueda}
                                placeholder="Buscar por nombre, correo, usuario o sucursal..."
                                aria-label="Buscar motorista"
                                onChange={(
                                    evento
                                ) =>
                                    setBusqueda(
                                        evento
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>

                        <select
                            aria-label="Filtrar por supervisor"
                            value={
                                filtroSupervisor
                            }
                            onChange={(
                                evento
                            ) =>
                                setFiltroSupervisor(
                                    evento
                                        .target
                                        .value
                                )
                            }
                        >
                            <option value="todos">
                                Todos los supervisores
                            </option>

                            <option value="sin-supervisor">
                                Sin supervisor
                            </option>

                            {supervisores.map(
                                (supervisor) => (
                                    <option
                                        key={
                                            supervisor.id_empleado
                                        }
                                        value={
                                            supervisor.id_empleado
                                        }
                                    >
                                        {
                                            supervisor.nombre
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        <select
                            aria-label="Filtrar por sucursal"
                            value={
                                filtroSucursal
                            }
                            onChange={(
                                evento
                            ) =>
                                setFiltroSucursal(
                                    evento
                                        .target
                                        .value
                                )
                            }
                        >
                            <option value="todas">
                                Todas las sucursales
                            </option>

                            <option value="sin-sucursal">
                                Sin sucursal
                            </option>

                            {sucursales.map(
                                (sucursal) => (
                                    <option
                                        key={
                                            sucursal.id_sucursal
                                        }
                                        value={
                                            sucursal.id_sucursal
                                        }
                                    >
                                        {
                                            sucursal.nombre
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        {hayFiltros && (
                            <button
                                type="button"
                                className="equipo-page__limpiar"
                                onClick={
                                    limpiarFiltros
                                }
                            >
                                Limpiar
                            </button>
                        )}
                    </div>


                    {/* ======================================================
                        TABLA
                        ====================================================== */}

                    {cargando ? (
                        <div className="equipo-page__estado">
                            <span className="equipo-page__loader" />

                            <strong>
                                Cargando equipo
                            </strong>

                            <p>
                                Obteniendo la información
                                operativa.
                            </p>
                        </div>
                    ) : empleadosFiltrados.length ===
                        0 ? (
                        <div className="equipo-page__estado">
                            <SearchIcon />

                            <strong>
                                Sin resultados
                            </strong>

                            <p>
                                No hay motoristas que
                                coincidan con los filtros
                                seleccionados.
                            </p>
                        </div>
                    ) : (
                        <div className="equipo-page__tabla-contenedor">
                            <table className="equipo-page__tabla">
                                <thead>
                                    <tr>
                                        <th>
                                            Motorista
                                        </th>

                                        <th>
                                            Sucursal
                                        </th>

                                        <th>
                                            Supervisor
                                        </th>

                                        <th>
                                            Contacto
                                        </th>

                                        <th>
                                            Último marcaje
                                        </th>

                                        <th>
                                            Jornada
                                        </th>

                                        <th>
                                            Acción
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {empleadosFiltrados.map(
                                        (
                                            empleado
                                        ) => {
                                            const ultimoMarcaje =
                                                empleado
                                                    .marcaje_marcaje_empleadoToempleado[0];

                                            return (
                                                <tr
                                                    key={
                                                        empleado.id_empleado
                                                    }
                                                >
                                                    <td>
                                                        <div className="equipo-page__empleado">
                                                            <span className="equipo-page__avatar">
                                                                {obtenerIniciales(
                                                                    empleado.nombre
                                                                )}
                                                            </span>

                                                            <div>
                                                                <strong>
                                                                    {
                                                                        empleado.nombre
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    @
                                                                    {
                                                                        empleado.username
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {empleado
                                                            .sucursal_empleado_sucursalTosucursal
                                                            ?.nombre ? (
                                                            <span className="equipo-page__dato">
                                                                {
                                                                    empleado
                                                                        .sucursal_empleado_sucursalTosucursal
                                                                        .nombre
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="equipo-page__pendiente">
                                                                Sin sucursal
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {empleado
                                                            .empleado
                                                            ?.nombre ? (
                                                            <span className="equipo-page__dato">
                                                                {
                                                                    empleado
                                                                        .empleado
                                                                        .nombre
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="equipo-page__pendiente">
                                                                Sin supervisor
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div className="equipo-page__contacto">
                                                            <span>
                                                                {
                                                                    empleado.correo
                                                                }
                                                            </span>

                                                            <small>
                                                                {empleado.telefono ||
                                                                    "Sin teléfono"}
                                                            </small>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {ultimoMarcaje ? (
                                                            <div className="equipo-page__marcaje">
                                                                <strong>
                                                                    {formatearFecha(
                                                                        ultimoMarcaje.fecha
                                                                    )}
                                                                </strong>

                                                                <small>
                                                                    {
                                                                        ultimoMarcaje.hora
                                                                    }
                                                                </small>
                                                            </div>
                                                        ) : (
                                                            <span className="equipo-page__sin-datos">
                                                                Sin marcajes
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {!ultimoMarcaje ? (
                                                            <span className="equipo-page__estado-jornada equipo-page__estado-jornada--sin-datos">
                                                                Sin datos
                                                            </span>
                                                        ) : ultimoMarcaje.es_entrada ? (
                                                            <span className="equipo-page__estado-jornada equipo-page__estado-jornada--activo">
                                                                <span />
                                                                En jornada
                                                            </span>
                                                        ) : (
                                                            <span className="equipo-page__estado-jornada equipo-page__estado-jornada--finalizado">
                                                                <span />
                                                                Finalizada
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="equipo-page__boton-editar"
                                                            onClick={() =>
                                                                abrirFormulario(
                                                                    empleado
                                                                )
                                                            }
                                                        >
                                                            <EditIcon />

                                                            Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>


                {/* ======================================================
                    MODAL
                    ====================================================== */}

                {empleadoSeleccionado && (
                    <div
                        className="equipo-page__modal-fondo"
                        role="presentation"
                        onMouseDown={(
                            evento
                        ) => {
                            if (
                                evento.target ===
                                evento.currentTarget
                            ) {
                                cerrarFormulario();
                            }
                        }}
                    >
                        <section
                            className="equipo-page__modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="titulo-editar-empleado"
                        >
                            <header className="equipo-page__modal-encabezado">
                                <div>
                                    <span>
                                        Asignación operativa
                                    </span>

                                    <h2 id="titulo-editar-empleado">
                                        {
                                            empleadoSeleccionado.nombre
                                        }
                                    </h2>

                                    <p>
                                        {
                                            empleadoSeleccionado.correo
                                        }
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="equipo-page__cerrar"
                                    onClick={
                                        cerrarFormulario
                                    }
                                    disabled={
                                        guardando
                                    }
                                    aria-label="Cerrar"
                                >
                                    ×
                                </button>
                            </header>

                            <form
                                className="equipo-page__formulario"
                                onSubmit={
                                    guardarCambios
                                }
                            >
                                <div className="equipo-page__grupo">
                                    <label htmlFor="empleado-sucursal">
                                        Sucursal
                                    </label>

                                    <select
                                        id="empleado-sucursal"
                                        value={
                                            formulario.sucursal
                                        }
                                        onChange={(
                                            evento
                                        ) =>
                                            actualizarFormulario(
                                                "sucursal",
                                                evento
                                                    .target
                                                    .value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Sin sucursal asignada
                                        </option>

                                        {sucursales.map(
                                            (
                                                sucursal
                                            ) => (
                                                <option
                                                    key={
                                                        sucursal.id_sucursal
                                                    }
                                                    value={
                                                        sucursal.id_sucursal
                                                    }
                                                >
                                                    {
                                                        sucursal.nombre
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="equipo-page__grupo">
                                    <label htmlFor="empleado-supervisor">
                                        Supervisor
                                    </label>

                                    <select
                                        id="empleado-supervisor"
                                        value={
                                            formulario.jefe
                                        }
                                        onChange={(
                                            evento
                                        ) =>
                                            actualizarFormulario(
                                                "jefe",
                                                evento
                                                    .target
                                                    .value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Sin supervisor asignado
                                        </option>

                                        {supervisoresDisponibles.map(
                                            (
                                                supervisor
                                            ) => (
                                                <option
                                                    key={
                                                        supervisor.id_empleado
                                                    }
                                                    value={
                                                        supervisor.id_empleado
                                                    }
                                                >
                                                    {
                                                        supervisor.nombre
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="equipo-page__grupo">
                                    <label htmlFor="empleado-telefono">
                                        Teléfono
                                    </label>

                                    <input
                                        id="empleado-telefono"
                                        type="tel"
                                        maxLength={15}
                                        value={
                                            formulario.telefono
                                        }
                                        placeholder="Ejemplo: 5555-5555"
                                        onChange={(
                                            evento
                                        ) =>
                                            actualizarFormulario(
                                                "telefono",
                                                evento
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="equipo-page__grupo equipo-page__grupo--completo">
                                    <label htmlFor="empleado-direccion">
                                        Dirección
                                    </label>

                                    <textarea
                                        id="empleado-direccion"
                                        maxLength={150}
                                        rows={3}
                                        value={
                                            formulario.direccion
                                        }
                                        placeholder="Dirección del empleado"
                                        onChange={(
                                            evento
                                        ) =>
                                            actualizarFormulario(
                                                "direccion",
                                                evento
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <footer className="equipo-page__acciones">
                                    <button
                                        type="button"
                                        className="equipo-page__boton-cancelar"
                                        onClick={
                                            cerrarFormulario
                                        }
                                        disabled={
                                            guardando
                                        }
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="equipo-page__boton-guardar"
                                        disabled={
                                            guardando
                                        }
                                    >
                                        {guardando
                                            ? "Guardando..."
                                            : "Guardar cambios"}
                                    </button>
                                </footer>
                            </form>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}