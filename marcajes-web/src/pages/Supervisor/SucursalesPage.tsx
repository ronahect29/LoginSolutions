import {
    useEffect,
    useMemo,
    useState,
    type FormEvent
} from "react";

import axios from "axios";

import { api } from "../../services/api";
import { useSession } from "../../hooks/useSession";

import type {
    ActualizarSucursalDto,
    CrearSucursalDto,
    FormularioSucursal,
    RespuestaSucursal,
    SucursalCatalogo
} from "../../models/sucursal";

import "../../styles/SucursalesPage.css";


// ======================================================
// CONFIGURACIÓN
// ======================================================

const formularioInicial: FormularioSucursal = {
    nombre: "",
    telefono: "",
    direccion: "",
    latitud: "",
    longitud: "",
    radio_marcaje_metros: "150",
    activo: true
};

const REGISTROS_POR_PAGINA = 8;


// ======================================================
// ICONOS
// ======================================================

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

function MapIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
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

function CurrentLocationIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="7" />
            <path d="M12 2v3" />
            <path d="M12 19v3" />
            <path d="M2 12h3" />
            <path d="M19 12h3" />
        </svg>
    );
}


// ======================================================
// HELPERS
// ======================================================

function obtenerMensajeError(
    error: unknown
): string {
    if (axios.isAxiosError(error)) {
        const mensaje =
            error.response?.data?.message;

        if (typeof mensaje === "string") {
            return mensaje;
        }
    }

    return "Ocurrió un error procesando la solicitud.";
}

function convertirCoordenada(
    valor: string
): number | null {
    const limpio = valor.trim();

    if (!limpio) {
        return null;
    }

    return Number(limpio);
}

function tieneUbicacion(
    sucursal: SucursalCatalogo
): boolean {
    return (
        sucursal.latitud !== null &&
        sucursal.longitud !== null
    );
}


// ======================================================
// COMPONENTE
// ======================================================

export function SucursalesPage() {
    const { empleado } = useSession();

    const [
        sucursales,
        setSucursales
    ] = useState<SucursalCatalogo[]>([]);

    const [
        busqueda,
        setBusqueda
    ] = useState("");

    const [
        filtroEstado,
        setFiltroEstado
    ] = useState("todas");

    const [
        filtroUbicacion,
        setFiltroUbicacion
    ] = useState("todas");

    const [
        pagina,
        setPagina
    ] = useState(1);

    const [
        cargando,
        setCargando
    ] = useState(true);

    const [
        guardando,
        setGuardando
    ] = useState(false);

    const [
        ubicando,
        setUbicando
    ] = useState(false);

    const [
        error,
        setError
    ] = useState<string | null>(null);

    const [
        mensaje,
        setMensaje
    ] = useState<string | null>(null);

    const [
        mensajeUbicacion,
        setMensajeUbicacion
    ] = useState<string | null>(null);

    const [
        mostrarFormulario,
        setMostrarFormulario
    ] = useState(false);

    const [
        sucursalEditando,
        setSucursalEditando
    ] = useState<SucursalCatalogo | null>(
        null
    );

    const [
        formulario,
        setFormulario
    ] = useState<FormularioSucursal>(
        formularioInicial
    );

    const usuarioAuditoria =
        empleado?.username ||
        empleado?.correo ||
        "sistema";


    // ======================================================
    // CARGA
    // ======================================================

    useEffect(() => {
        void cargarSucursales();
    }, []);

    async function cargarSucursales() {
        setCargando(true);
        setError(null);

        try {
            const respuesta =
                await api.get<SucursalCatalogo[]>(
                    "/sucursal/findAll"
                );

            setSucursales(
                respuesta.data
            );
        } catch (errorSolicitud) {
            setError(
                obtenerMensajeError(
                    errorSolicitud
                )
            );
        } finally {
            setCargando(false);
        }
    }


    // ======================================================
    // RESUMEN
    // ======================================================

    const resumen = useMemo(() => {
        const activas =
            sucursales.filter(
                (sucursal) =>
                    sucursal.activo === true
            ).length;

        const conUbicacion =
            sucursales.filter(
                tieneUbicacion
            ).length;

        return {
            total:
                sucursales.length,

            activas,

            conUbicacion,

            sinUbicacion:
                sucursales.length -
                conUbicacion
        };
    }, [sucursales]);


    // ======================================================
    // FILTROS
    // ======================================================

    const sucursalesFiltradas =
        useMemo(() => {
            const termino =
                busqueda
                    .trim()
                    .toLowerCase();

            return sucursales.filter(
                (sucursal) => {
                    const coincideTexto =
                        !termino ||
                        sucursal.nombre
                            .toLowerCase()
                            .includes(termino) ||
                        sucursal.direccion
                            .toLowerCase()
                            .includes(termino) ||
                        (
                            sucursal.telefono ??
                            ""
                        )
                            .toLowerCase()
                            .includes(termino);

                    const coincideEstado =
                        filtroEstado ===
                            "todas" ||
                        (
                            filtroEstado ===
                                "activas" &&
                            sucursal.activo ===
                                true
                        ) ||
                        (
                            filtroEstado ===
                                "inactivas" &&
                            sucursal.activo !==
                                true
                        );

                    const configurada =
                        tieneUbicacion(
                            sucursal
                        );

                    const coincideUbicacion =
                        filtroUbicacion ===
                            "todas" ||
                        (
                            filtroUbicacion ===
                                "configuradas" &&
                            configurada
                        ) ||
                        (
                            filtroUbicacion ===
                                "pendientes" &&
                            !configurada
                        );

                    return (
                        coincideTexto &&
                        coincideEstado &&
                        coincideUbicacion
                    );
                }
            );
        }, [
            sucursales,
            busqueda,
            filtroEstado,
            filtroUbicacion
        ]);


    useEffect(() => {
        setPagina(1);
    }, [
        busqueda,
        filtroEstado,
        filtroUbicacion
    ]);


    // ======================================================
    // PAGINACIÓN
    // ======================================================

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                sucursalesFiltradas.length /
                    REGISTROS_POR_PAGINA
            )
        );

    const sucursalesPagina =
        useMemo(() => {
            const inicio =
                (
                    pagina - 1
                ) *
                REGISTROS_POR_PAGINA;

            return sucursalesFiltradas.slice(
                inicio,
                inicio +
                    REGISTROS_POR_PAGINA
            );
        }, [
            sucursalesFiltradas,
            pagina
        ]);


    // ======================================================
    // FORMULARIO
    // ======================================================

    function abrirFormularioCrear() {
        setSucursalEditando(null);

        setFormulario(
            formularioInicial
        );

        setError(null);
        setMensaje(null);
        setMensajeUbicacion(null);

        setMostrarFormulario(true);
    }

    function abrirFormularioEditar(
        sucursal: SucursalCatalogo
    ) {
        setSucursalEditando(
            sucursal
        );

        setFormulario({
            nombre:
                sucursal.nombre,

            telefono:
                sucursal.telefono ??
                "",

            direccion:
                sucursal.direccion,

            latitud:
                sucursal.latitud !==
                null
                    ? String(
                        sucursal.latitud
                    )
                    : "",

            longitud:
                sucursal.longitud !==
                null
                    ? String(
                        sucursal.longitud
                    )
                    : "",

            radio_marcaje_metros:
                String(
                    sucursal
                        .radio_marcaje_metros
                ),

            activo:
                sucursal.activo ===
                true
        });

        setError(null);
        setMensaje(null);
        setMensajeUbicacion(null);

        setMostrarFormulario(true);
    }

    function cerrarFormulario() {
        if (
            guardando ||
            ubicando
        ) {
            return;
        }

        setMostrarFormulario(false);
        setSucursalEditando(null);

        setFormulario(
            formularioInicial
        );

        setMensajeUbicacion(null);
    }

    function actualizarCampo<
        K extends keyof FormularioSucursal
    >(
        campo: K,
        valor:
            FormularioSucursal[K]
    ) {
        setFormulario(
            (actual) => ({
                ...actual,
                [campo]: valor
            })
        );
    }


    // ======================================================
    // GEOLOCALIZACIÓN
    // ======================================================

    function obtenerUbicacionActual() {
        if (
            !navigator.geolocation
        ) {
            setError(
                "El navegador no permite obtener la ubicación."
            );

            return;
        }

        setUbicando(true);
        setError(null);

        setMensajeUbicacion(
            "Obteniendo ubicación..."
        );

        navigator.geolocation
            .getCurrentPosition(
                (posicion) => {
                    const latitud =
                        posicion.coords
                            .latitude
                            .toFixed(6);

                    const longitud =
                        posicion.coords
                            .longitude
                            .toFixed(6);

                    setFormulario(
                        (actual) => ({
                            ...actual,
                            latitud,
                            longitud
                        })
                    );

                    setMensajeUbicacion(
                        "Ubicación capturada. Verifica el punto antes de guardar."
                    );

                    setUbicando(false);
                },

                (errorUbicacion) => {
                    let detalle =
                        "No fue posible obtener la ubicación.";

                    if (
                        errorUbicacion.code ===
                        errorUbicacion
                            .PERMISSION_DENIED
                    ) {
                        detalle =
                            "El permiso de ubicación fue rechazado.";
                    }

                    if (
                        errorUbicacion.code ===
                        errorUbicacion
                            .POSITION_UNAVAILABLE
                    ) {
                        detalle =
                            "La ubicación no está disponible en este dispositivo.";
                    }

                    if (
                        errorUbicacion.code ===
                        errorUbicacion
                            .TIMEOUT
                    ) {
                        detalle =
                            "La solicitud de ubicación tardó demasiado.";
                    }

                    setMensajeUbicacion(null);
                    setError(detalle);
                    setUbicando(false);
                },

                {
                    enableHighAccuracy:
                        true,

                    timeout:
                        15000,

                    maximumAge:
                        0
                }
            );
    }

    function abrirGoogleMaps(
        latitud: string,
        longitud: string
    ) {
        if (
            !latitud.trim() ||
            !longitud.trim()
        ) {
            return;
        }

        const coordenadas =
            `${latitud.trim()},${longitud.trim()}`;

        window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                coordenadas
            )}`,
            "_blank",
            "noopener,noreferrer"
        );
    }


    // ======================================================
    // VALIDACIÓN
    // ======================================================

    function validarFormulario():
        string | null {
        if (
            !formulario.nombre.trim()
        ) {
            return "El nombre de la sucursal es obligatorio.";
        }

        if (
            !formulario.direccion.trim()
        ) {
            return "La dirección de la sucursal es obligatoria.";
        }

        const tieneLatitud =
            formulario.latitud
                .trim() !== "";

        const tieneLongitud =
            formulario.longitud
                .trim() !== "";

        if (
            tieneLatitud !==
            tieneLongitud
        ) {
            return "Debes ingresar latitud y longitud juntas.";
        }

        if (tieneLatitud) {
            const latitud =
                Number(
                    formulario.latitud
                );

            if (
                !Number.isFinite(
                    latitud
                ) ||
                latitud < -90 ||
                latitud > 90
            ) {
                return "La latitud ingresada no es válida.";
            }
        }

        if (tieneLongitud) {
            const longitud =
                Number(
                    formulario.longitud
                );

            if (
                !Number.isFinite(
                    longitud
                ) ||
                longitud < -180 ||
                longitud > 180
            ) {
                return "La longitud ingresada no es válida.";
            }
        }

        const radio =
            Number(
                formulario
                    .radio_marcaje_metros
            );

        if (
            !Number.isInteger(
                radio
            ) ||
            radio < 10 ||
            radio > 5000
        ) {
            return "El radio debe ser un número entero entre 10 y 5000 metros.";
        }

        return null;
    }


    // ======================================================
    // GUARDAR
    // ======================================================

    async function guardarSucursal(
        event:
            FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const errorValidacion =
            validarFormulario();

        if (errorValidacion) {
            setError(
                errorValidacion
            );

            return;
        }

        setGuardando(true);
        setError(null);
        setMensaje(null);

        const latitud =
            convertirCoordenada(
                formulario.latitud
            );

        const longitud =
            convertirCoordenada(
                formulario.longitud
            );

        try {
            if (sucursalEditando) {
                const datos:
                    ActualizarSucursalDto =
                    {
                        nombre:
                            formulario.nombre
                                .trim(),

                        telefono:
                            formulario.telefono
                                .trim() ||
                            null,

                        direccion:
                            formulario.direccion
                                .trim(),

                        latitud,
                        longitud,

                        radio_marcaje_metros:
                            Number(
                                formulario
                                    .radio_marcaje_metros
                            ),

                        activo:
                            formulario.activo,

                        modificador:
                            usuarioAuditoria
                    };

                const respuesta =
                    await api.put<
                        RespuestaSucursal
                    >(
                        `/sucursal/update/${sucursalEditando.id_sucursal}`,
                        datos
                    );

                setMensaje(
                    respuesta.data
                        .message
                );
            } else {
                const datos:
                    CrearSucursalDto =
                    {
                        nombre:
                            formulario.nombre
                                .trim(),

                        telefono:
                            formulario.telefono
                                .trim() ||
                            null,

                        direccion:
                            formulario.direccion
                                .trim(),

                        latitud,
                        longitud,

                        radio_marcaje_metros:
                            Number(
                                formulario
                                    .radio_marcaje_metros
                            ),

                        activo:
                            formulario.activo,

                        creador:
                            usuarioAuditoria
                    };

                const respuesta =
                    await api.post<
                        RespuestaSucursal
                    >(
                        "/sucursal/create",
                        datos
                    );

                setMensaje(
                    respuesta.data
                        .message
                );
            }

            await cargarSucursales();

            setMostrarFormulario(false);
            setSucursalEditando(null);

            setFormulario(
                formularioInicial
            );

            setMensajeUbicacion(null);
        } catch (errorSolicitud) {
            setError(
                obtenerMensajeError(
                    errorSolicitud
                )
            );
        } finally {
            setGuardando(false);
        }
    }


    // ======================================================
    // CAMBIAR ESTADO
    // ======================================================

    async function cambiarEstado(
        sucursal:
            SucursalCatalogo
    ) {
        const nuevoEstado =
            sucursal.activo !==
            true;

        const accion =
            nuevoEstado
                ? "activar"
                : "desactivar";

        const confirmado =
            window.confirm(
                `¿Deseas ${accion} la sucursal "${sucursal.nombre}"?`
            );

        if (!confirmado) {
            return;
        }

        setError(null);
        setMensaje(null);

        try {
            const respuesta =
                await api.patch<
                    RespuestaSucursal
                >(
                    `/sucursal/changeStatus/${sucursal.id_sucursal}`,
                    {
                        activo:
                            nuevoEstado,

                        modificador:
                            usuarioAuditoria
                    }
                );

            setMensaje(
                respuesta.data
                    .message
            );

            await cargarSucursales();
        } catch (errorSolicitud) {
            setError(
                obtenerMensajeError(
                    errorSolicitud
                )
            );
        }
    }


    // ======================================================
    // VISTA
    // ======================================================

    return (
        <main className="sucursales-page">
            <div className="sucursales-shell">

                <section className="sucursales-header">
                    <div className="sucursales-header-content">
                        <span className="sucursales-header-icon">
                            <BranchIcon />
                        </span>

                        <div>
                            <span className="sucursales-eyebrow">
                                Configuración operativa
                            </span>

                            <h1>
                                Catálogo de sucursales
                            </h1>

                            <p>
                                Administra las ubicaciones
                                autorizadas y el radio permitido
                                para los marcajes del personal.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="sucursales-btn-primary"
                        onClick={
                            abrirFormularioCrear
                        }
                    >
                        <span>
                            +
                        </span>

                        Nueva sucursal
                    </button>
                </section>


                <section className="sucursales-summary">
                    <article className="sucursales-summary-card">
                        <span className="sucursales-summary-icon sucursales-summary-icon-primary">
                            <BranchIcon />
                        </span>

                        <div>
                            <span>
                                Total
                            </span>

                            <strong>
                                {resumen.total}
                            </strong>
                        </div>
                    </article>

                    <article className="sucursales-summary-card">
                        <span className="sucursales-summary-icon sucursales-summary-icon-success">
                            <CheckIcon />
                        </span>

                        <div>
                            <span>
                                Activas
                            </span>

                            <strong>
                                {resumen.activas}
                            </strong>
                        </div>
                    </article>

                    <article className="sucursales-summary-card">
                        <span className="sucursales-summary-icon sucursales-summary-icon-map">
                            <MapIcon />
                        </span>

                        <div>
                            <span>
                                Con ubicación
                            </span>

                            <strong>
                                {
                                    resumen
                                        .conUbicacion
                                }
                            </strong>
                        </div>
                    </article>

                    <article className="sucursales-summary-card">
                        <span className="sucursales-summary-icon sucursales-summary-icon-warning">
                            <WarningIcon />
                        </span>

                        <div>
                            <span>
                                Sin ubicación
                            </span>

                            <strong>
                                {
                                    resumen
                                        .sinUbicacion
                                }
                            </strong>
                        </div>
                    </article>
                </section>


                {mensaje && (
                    <div className="sucursales-alert sucursales-alert-success">
                        {mensaje}
                    </div>
                )}

                {error && (
                    <div className="sucursales-alert sucursales-alert-error">
                        {error}
                    </div>
                )}


                <section className="sucursales-content">
                    <header className="sucursales-content-header">
                        <div>
                            <h2>
                                Sucursales registradas
                            </h2>

                            <p>
                                Consulta y configura los
                                puntos autorizados de marcaje.
                            </p>
                        </div>

                        <span className="sucursales-results">
                            {
                                sucursalesFiltradas
                                    .length
                            }{" "}
                            resultados
                        </span>
                    </header>


                    <div className="sucursales-toolbar">
                        <div className="sucursales-search">
                            <SearchIcon />

                            <input
                                type="search"
                                value={busqueda}
                                onChange={(event) =>
                                    setBusqueda(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Buscar sucursal, dirección o teléfono..."
                            />
                        </div>

                        <select
                            value={filtroEstado}
                            onChange={(event) =>
                                setFiltroEstado(
                                    event.target
                                        .value
                                )
                            }
                        >
                            <option value="todas">
                                Todos los estados
                            </option>

                            <option value="activas">
                                Activas
                            </option>

                            <option value="inactivas">
                                Inactivas
                            </option>
                        </select>

                        <select
                            value={filtroUbicacion}
                            onChange={(event) =>
                                setFiltroUbicacion(
                                    event.target
                                        .value
                                )
                            }
                        >
                            <option value="todas">
                                Todas las ubicaciones
                            </option>

                            <option value="configuradas">
                                Con ubicación
                            </option>

                            <option value="pendientes">
                                Sin ubicación
                            </option>
                        </select>
                    </div>


                    <div className="sucursales-table-wrapper">
                        <table className="sucursales-table">
                            <thead>
                                <tr>
                                    <th>
                                        Sucursal
                                    </th>

                                    <th>
                                        Contacto
                                    </th>

                                    <th>
                                        Ubicación
                                    </th>

                                    <th>
                                        Radio
                                    </th>

                                    <th>
                                        Estado
                                    </th>

                                    <th>
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {cargando ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="sucursales-empty"
                                        >
                                            Cargando
                                            sucursales...
                                        </td>
                                    </tr>
                                ) : sucursalesPagina.length ===
                                  0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="sucursales-empty"
                                        >
                                            No se encontraron
                                            sucursales.
                                        </td>
                                    </tr>
                                ) : (
                                    sucursalesPagina.map(
                                        (sucursal) => {
                                            const configurada =
                                                tieneUbicacion(
                                                    sucursal
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        sucursal.id_sucursal
                                                    }
                                                >
                                                    <td>
                                                        <div className="sucursales-name">
                                                            <strong>
                                                                {
                                                                    sucursal.nombre
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    sucursal.direccion
                                                                }
                                                            </span>

                                                            <small>
                                                                ID:{" "}
                                                                {
                                                                    sucursal.id_sucursal
                                                                }
                                                            </small>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span className="sucursales-phone">
                                                            {sucursal.telefono ||
                                                                "Sin teléfono"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {configurada ? (
                                                            <div className="sucursales-location">
                                                                <span className="sucursales-location-ready">
                                                                    <span />
                                                                    Configurada
                                                                </span>

                                                                <small>
                                                                    {
                                                                        sucursal.latitud
                                                                    }
                                                                    ,{" "}
                                                                    {
                                                                        sucursal.longitud
                                                                    }
                                                                </small>

                                                                <button
                                                                    type="button"
                                                                    className="sucursales-map-link"
                                                                    onClick={() =>
                                                                        abrirGoogleMaps(
                                                                            String(
                                                                                sucursal.latitud
                                                                            ),
                                                                            String(
                                                                                sucursal.longitud
                                                                            )
                                                                        )
                                                                    }
                                                                >
                                                                    <MapIcon />

                                                                    Ver mapa
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="sucursales-location-pending"
                                                                onClick={() =>
                                                                    abrirFormularioEditar(
                                                                        sucursal
                                                                    )
                                                                }
                                                            >
                                                                <WarningIcon />

                                                                Configurar ubicación
                                                            </button>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span className="sucursales-radius">
                                                            {
                                                                sucursal
                                                                    .radio_marcaje_metros
                                                            }{" "}
                                                            m
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={
                                                                sucursal.activo
                                                                    ? "sucursales-status sucursales-status-active"
                                                                    : "sucursales-status sucursales-status-inactive"
                                                            }
                                                        >
                                                            {sucursal.activo
                                                                ? "Activa"
                                                                : "Inactiva"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="sucursales-actions">
                                                            <button
                                                                type="button"
                                                                className="sucursales-btn-edit"
                                                                onClick={() =>
                                                                    abrirFormularioEditar(
                                                                        sucursal
                                                                    )
                                                                }
                                                            >
                                                                <EditIcon />

                                                                Editar
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className={
                                                                    sucursal.activo
                                                                        ? "sucursales-btn-disable"
                                                                        : "sucursales-btn-enable"
                                                                }
                                                                onClick={() =>
                                                                    void cambiarEstado(
                                                                        sucursal
                                                                    )
                                                                }
                                                            >
                                                                {sucursal.activo
                                                                    ? "Desactivar"
                                                                    : "Activar"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>


                    {!cargando &&
                        sucursalesFiltradas.length >
                            0 && (
                        <footer className="sucursales-pagination">
                            <span>
                                Página {pagina} de{" "}
                                {totalPaginas}
                            </span>

                            <div>
                                <button
                                    type="button"
                                    disabled={
                                        pagina <= 1
                                    }
                                    onClick={() =>
                                        setPagina(
                                            (
                                                actual
                                            ) =>
                                                actual -
                                                1
                                        )
                                    }
                                >
                                    Anterior
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        pagina >=
                                        totalPaginas
                                    }
                                    onClick={() =>
                                        setPagina(
                                            (
                                                actual
                                            ) =>
                                                actual +
                                                1
                                        )
                                    }
                                >
                                    Siguiente
                                </button>
                            </div>
                        </footer>
                    )}
                </section>


                {mostrarFormulario && (
                    <div
                        className="sucursales-modal-backdrop"
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                cerrarFormulario();
                            }
                        }}
                    >
                        <section className="sucursales-modal">
                            <header className="sucursales-modal-header">
                                <div>
                                    <span>
                                        {sucursalEditando
                                            ? "Editar sucursal"
                                            : "Nueva sucursal"}
                                    </span>

                                    <h2>
                                        {sucursalEditando
                                            ? sucursalEditando.nombre
                                            : "Registrar sucursal"}
                                    </h2>

                                    <p>
                                        Configura la información
                                        general y el punto autorizado
                                        de marcaje.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="sucursales-modal-close"
                                    onClick={
                                        cerrarFormulario
                                    }
                                    disabled={
                                        guardando ||
                                        ubicando
                                    }
                                >
                                    ×
                                </button>
                            </header>


                            <form
                                className="sucursales-form"
                                onSubmit={
                                    guardarSucursal
                                }
                            >
                                <div className="sucursales-form-title sucursales-field-full">
                                    <h3>
                                        Información general
                                    </h3>
                                </div>

                                <div className="sucursales-field sucursales-field-full">
                                    <label>
                                        Nombre
                                    </label>

                                    <input
                                        type="text"
                                        maxLength={150}
                                        value={
                                            formulario.nombre
                                        }
                                        onChange={(event) =>
                                            actualizarCampo(
                                                "nombre",
                                                event.target
                                                    .value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="sucursales-field sucursales-field-full">
                                    <label>
                                        Dirección
                                    </label>

                                    <textarea
                                        maxLength={200}
                                        rows={2}
                                        value={
                                            formulario.direccion
                                        }
                                        onChange={(event) =>
                                            actualizarCampo(
                                                "direccion",
                                                event.target
                                                    .value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="sucursales-field">
                                    <label>
                                        Teléfono
                                    </label>

                                    <input
                                        type="text"
                                        maxLength={10}
                                        value={
                                            formulario.telefono
                                        }
                                        onChange={(event) =>
                                            actualizarCampo(
                                                "telefono",
                                                event.target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="sucursales-field">
                                    <label>
                                        Radio permitido
                                    </label>

                                    <div className="sucursales-input-suffix">
                                        <input
                                            type="number"
                                            min={10}
                                            max={5000}
                                            step={1}
                                            value={
                                                formulario
                                                    .radio_marcaje_metros
                                            }
                                            onChange={(event) =>
                                                actualizarCampo(
                                                    "radio_marcaje_metros",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            required
                                        />

                                        <span>
                                            metros
                                        </span>
                                    </div>
                                </div>


                                <section className="sucursales-location-editor sucursales-field-full">
                                    <header>
                                        <div>
                                            <span>
                                                <MapIcon />
                                            </span>

                                            <div>
                                                <h3>
                                                    Ubicación de marcaje
                                                </h3>

                                                <p>
                                                    Coordenadas usadas
                                                    para validar la
                                                    distancia del
                                                    motorista.
                                                </p>
                                            </div>
                                        </div>
                                    </header>

                                    <div className="sucursales-location-editor-actions">
                                        <button
                                            type="button"
                                            className="sucursales-current-location"
                                            onClick={
                                                obtenerUbicacionActual
                                            }
                                            disabled={
                                                ubicando
                                            }
                                        >
                                            <CurrentLocationIcon />

                                            {ubicando
                                                ? "Obteniendo..."
                                                : "Usar mi ubicación actual"}
                                        </button>

                                        {formulario.latitud &&
                                            formulario.longitud && (
                                            <button
                                                type="button"
                                                className="sucursales-preview-location"
                                                onClick={() =>
                                                    abrirGoogleMaps(
                                                        formulario.latitud,
                                                        formulario.longitud
                                                    )
                                                }
                                            >
                                                <MapIcon />

                                                Ver en Google Maps
                                            </button>
                                        )}
                                    </div>

                                    {mensajeUbicacion && (
                                        <div className="sucursales-location-message">
                                            <CheckIcon />

                                            {
                                                mensajeUbicacion
                                            }
                                        </div>
                                    )}

                                    <div className="sucursales-location-fields">
                                        <div className="sucursales-field">
                                            <label>
                                                Latitud
                                            </label>

                                            <input
                                                type="number"
                                                step="0.000001"
                                                min={-90}
                                                max={90}
                                                value={
                                                    formulario.latitud
                                                }
                                                onChange={(event) =>
                                                    actualizarCampo(
                                                        "latitud",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="14.634915"
                                            />
                                        </div>

                                        <div className="sucursales-field">
                                            <label>
                                                Longitud
                                            </label>

                                            <input
                                                type="number"
                                                step="0.000001"
                                                min={-180}
                                                max={180}
                                                value={
                                                    formulario.longitud
                                                }
                                                onChange={(event) =>
                                                    actualizarCampo(
                                                        "longitud",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="-90.506882"
                                            />
                                        </div>
                                    </div>

                                    <p className="sucursales-location-help">
                                        Si estás físicamente en la
                                        sucursal, utiliza
                                        “Usar mi ubicación actual”.
                                        También puedes copiar las
                                        coordenadas desde Google Maps
                                        y pegarlas manualmente.
                                    </p>
                                </section>


                                <label className="sucursales-switch-row">
                                    <input
                                        type="checkbox"
                                        checked={
                                            formulario.activo
                                        }
                                        onChange={(event) =>
                                            actualizarCampo(
                                                "activo",
                                                event.target
                                                    .checked
                                            )
                                        }
                                    />

                                    <span className="sucursales-switch" />

                                    <span>
                                        Sucursal activa

                                        <small>
                                            Disponible para
                                            asignaciones y marcajes.
                                        </small>
                                    </span>
                                </label>


                                <footer className="sucursales-form-actions">
                                    <button
                                        type="button"
                                        className="sucursales-btn-secondary"
                                        onClick={
                                            cerrarFormulario
                                        }
                                        disabled={
                                            guardando ||
                                            ubicando
                                        }
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="sucursales-btn-primary"
                                        disabled={
                                            guardando ||
                                            ubicando
                                        }
                                    >
                                        {guardando
                                            ? "Guardando..."
                                            : sucursalEditando
                                                ? "Guardar cambios"
                                                : "Registrar sucursal"}
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