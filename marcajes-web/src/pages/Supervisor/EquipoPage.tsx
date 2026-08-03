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

function obtenerMensajeError(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
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

function obtenerIniciales(nombre: string): string {
    return nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((palabra) =>
            palabra.charAt(0).toUpperCase()
        )
        .join("");
}

function formatearFecha(fecha: string): string {
    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) {
        return fecha;
    }

    return valor.toLocaleDateString("es-GT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

export function EquipoPage() {
    const { empleado: empleadoSesion } = useSession();

    const [empleados, setEmpleados] =
        useState<EmpleadoEquipo[]>([]);

    const [usuariosServicio, setUsuariosServicio] =
        useState<UsuarioServicio[]>([]);

    const [sucursales, setSucursales] =
        useState<FiltroSucursal[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [busqueda, setBusqueda] =
        useState("");

    const [filtroSucursal, setFiltroSucursal] =
        useState("todas");

    const [filtroSupervisor, setFiltroSupervisor] =
        useState("todos");

    const [
        empleadoSeleccionado,
        setEmpleadoSeleccionado
    ] = useState<EmpleadoEquipo | null>(null);

    const [formulario, setFormulario] =
        useState<FormularioEmpleadoEquipo>(
            formularioInicial
        );

    const [mensaje, setMensaje] =
        useState<string | null>(null);

    const [error, setError] =
        useState<string | null>(null);

    const cargarInformacion =
        useCallback(async () => {
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
            } catch (errorPeticion) {
                setError(
                    obtenerMensajeError(
                        errorPeticion
                    )
                );
            } finally {
                setCargando(false);
            }
        }, []);

    useEffect(() => {
        void cargarInformacion();
    }, [cargarInformacion]);

    const usuariosPorId = useMemo(() => {
        return new Map(
            usuariosServicio.map((usuario) => [
                usuario.id_usuario,
                usuario
            ])
        );
    }, [usuariosServicio]);

    /**
     * Solo se consideran motoristas:
     *
     * - Usuario activo.
     * - Rol activo COL-PMW.
     * - Registro operativo en empleado.
     */
    const motoristas = useMemo(() => {
        return empleados
            .filter((empleado) => {
                const usuario =
                    usuariosPorId.get(
                        empleado.id_auth
                    );

                return (
                    usuario?.activo === true &&
                    usuario.roles.includes(
                        "COL-PMW"
                    )
                );
            })
            .sort((a, b) =>
                a.nombre.localeCompare(
                    b.nombre,
                    "es"
                )
            );
    }, [empleados, usuariosPorId]);

    /**
     * Solo se consideran supervisores:
     *
     * - Usuario activo.
     * - Rol activo SUP-PMW.
     * - Registro operativo en empleado.
     */
    const supervisores = useMemo(() => {
        return empleados
            .filter((empleado) => {
                const usuario =
                    usuariosPorId.get(
                        empleado.id_auth
                    );

                return (
                    usuario?.activo === true &&
                    usuario.roles.includes(
                        "SUP-PMW"
                    )
                );
            })
            .sort((a, b) =>
                a.nombre.localeCompare(
                    b.nombre,
                    "es"
                )
            );
    }, [empleados, usuariosPorId]);

    const idsSupervisoresActivos =
        useMemo(() => {
            return new Set(
                supervisores.map(
                    (supervisor) =>
                        supervisor.id_empleado
                )
            );
        }, [supervisores]);

    const empleadosFiltrados =
        useMemo(() => {
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
                            .includes(texto) ||
                        empleado.correo
                            .toLowerCase()
                            .includes(texto) ||
                        empleado.username
                            .toLowerCase()
                            .includes(texto) ||
                        empleado.telefono
                            ?.toLowerCase()
                            .includes(texto) ||
                        sucursalAsignada
                            .toLowerCase()
                            .includes(texto) ||
                        supervisorAsignado
                            .toLowerCase()
                            .includes(texto);

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
                        empleado.jefe === null ||
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
        }, [
            motoristas,
            busqueda,
            filtroSucursal,
            filtroSupervisor,
            idsSupervisoresActivos
        ]);

    const resumen = useMemo(() => {
        const conSucursal =
            motoristas.filter(
                (empleado) =>
                    empleado.sucursal !== null
            ).length;

        const sinSucursal =
            motoristas.length -
            conSucursal;

        const sinSupervisor =
            motoristas.filter(
                (empleado) =>
                    empleado.jefe === null ||
                    !idsSupervisoresActivos.has(
                        empleado.jefe
                    )
            ).length;

        return {
            total: motoristas.length,
            conSucursal,
            sinSucursal,
            sinSupervisor
        };
    }, [
        motoristas,
        idsSupervisoresActivos
    ]);

    const conteoPorSupervisor =
        useMemo(() => {
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
                        motorista.jefe === null ||
                        !idsSupervisoresActivos.has(
                            motorista.jefe
                        )
                ).length;

            return {
                supervisores: resultados,
                sinSupervisor
            };
        }, [
            supervisores,
            motoristas,
            idsSupervisoresActivos
        ]);

    const conteoPorSucursal =
        useMemo(() => {
            const resultados =
                sucursales
                    .map((sucursal) => ({
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
                    }))
                    .sort((a, b) =>
                        a.nombre.localeCompare(
                            b.nombre,
                            "es"
                        )
                    );

            const sinSucursal =
                motoristas.filter(
                    (motorista) =>
                        motorista.sucursal === null
                ).length;

            return {
                sucursales: resultados,
                sinSucursal
            };
        }, [
            sucursales,
            motoristas
        ]);

    const supervisoresDisponibles =
        useMemo(() => {
            return supervisores.filter(
                (supervisor) =>
                    supervisor.id_empleado !==
                    empleadoSeleccionado
                        ?.id_empleado
            );
        }, [
            supervisores,
            empleadoSeleccionado
                ?.id_empleado
        ]);

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

        setEmpleadoSeleccionado(null);
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
                (empleadosActuales) =>
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
        } catch (errorPeticion) {
            setError(
                obtenerMensajeError(
                    errorPeticion
                )
            );
        } finally {
            setGuardando(false);
        }
    }

    return (
        <main className="equipo-page">
            <section className="equipo-page__encabezado">
                <div>
                    <p className="equipo-page__eyebrow">
                        Gestión operativa
                    </p>

                    <h1>
                        Equipo de motoristas
                    </h1>

                    <p>
                        Consulta la distribución
                        del personal por supervisor
                        y sucursal, y administra
                        sus asignaciones operativas.
                    </p>
                </div>

                <button
                    type="button"
                    className="equipo-page__boton-secundario"
                    onClick={() =>
                        void cargarInformacion()
                    }
                    disabled={cargando}
                >
                    {cargando
                        ? "Actualizando..."
                        : "Actualizar datos"}
                </button>
            </section>

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

            <section className="equipo-page__resumen">
                <article className="equipo-page__tarjeta-resumen">
                    <span>
                        Total de motoristas
                    </span>

                    <strong>
                        {resumen.total}
                    </strong>
                </article>

                <article className="equipo-page__tarjeta-resumen">
                    <span>
                        Con sucursal
                    </span>

                    <strong>
                        {resumen.conSucursal}
                    </strong>
                </article>

                <article className="equipo-page__tarjeta-resumen">
                    <span>
                        Sin sucursal
                    </span>

                    <strong>
                        {resumen.sinSucursal}
                    </strong>
                </article>

                <article className="equipo-page__tarjeta-resumen">
                    <span>
                        Sin supervisor
                    </span>

                    <strong>
                        {resumen.sinSupervisor}
                    </strong>
                </article>
            </section>

            <section className="equipo-page__distribuciones">
                <article className="equipo-page__distribucion">
                    <header className="equipo-page__distribucion-encabezado">
                        <div>
                            <h2>
                                Motoristas por supervisor
                            </h2>

                            <p>
                                Selecciona un supervisor
                                para filtrar la tabla.
                            </p>
                        </div>
                    </header>

                    <div className="equipo-page__distribucion-lista">
                        {conteoPorSupervisor
                            .supervisores
                            .map(
                                (supervisor) => (
                                    <button
                                        key={
                                            supervisor.id
                                        }
                                        type="button"
                                        className={[
                                            "equipo-page__distribucion-item",
                                            filtroSupervisor ===
                                            String(
                                                supervisor.id
                                            )
                                                ? "equipo-page__distribucion-item--activo"
                                                : ""
                                        ]
                                            .filter(
                                                Boolean
                                            )
                                            .join(
                                                " "
                                            )}
                                        aria-pressed={
                                            filtroSupervisor ===
                                            String(
                                                supervisor.id
                                            )
                                        }
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
                            className={[
                                "equipo-page__distribucion-item",
                                filtroSupervisor ===
                                "sin-supervisor"
                                    ? "equipo-page__distribucion-item--activo"
                                    : ""
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            aria-pressed={
                                filtroSupervisor ===
                                "sin-supervisor"
                            }
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
                    <header className="equipo-page__distribucion-encabezado">
                        <div>
                            <h2>
                                Motoristas por sucursal
                            </h2>

                            <p>
                                Selecciona una sucursal
                                para filtrar la tabla.
                            </p>
                        </div>
                    </header>

                    <div className="equipo-page__distribucion-lista equipo-page__distribucion-lista--sucursales">
                        {conteoPorSucursal
                            .sucursales
                            .map(
                                (sucursal) => (
                                    <button
                                        key={
                                            sucursal.id
                                        }
                                        type="button"
                                        className={[
                                            "equipo-page__distribucion-item",
                                            filtroSucursal ===
                                            String(
                                                sucursal.id
                                            )
                                                ? "equipo-page__distribucion-item--activo"
                                                : ""
                                        ]
                                            .filter(
                                                Boolean
                                            )
                                            .join(
                                                " "
                                            )}
                                        aria-pressed={
                                            filtroSucursal ===
                                            String(
                                                sucursal.id
                                            )
                                        }
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
                            className={[
                                "equipo-page__distribucion-item",
                                filtroSucursal ===
                                "sin-sucursal"
                                    ? "equipo-page__distribucion-item--activo"
                                    : ""
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            aria-pressed={
                                filtroSucursal ===
                                "sin-sucursal"
                            }
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
            </section>

            <section className="equipo-page__contenido">
                <div className="equipo-page__filtros">
                    <div className="equipo-page__campo-busqueda">
                        <label htmlFor="busqueda-equipo">
                            Buscar motorista
                        </label>

                        <input
                            id="busqueda-equipo"
                            type="search"
                            value={busqueda}
                            placeholder="Nombre, correo, usuario o sucursal"
                            onChange={(evento) =>
                                setBusqueda(
                                    evento.target.value
                                )
                            }
                        />
                    </div>

                    <div className="equipo-page__campo-filtro">
                        <label htmlFor="filtro-supervisor-equipo">
                            Supervisor
                        </label>

                        <select
                            id="filtro-supervisor-equipo"
                            value={
                                filtroSupervisor
                            }
                            onChange={(evento) =>
                                setFiltroSupervisor(
                                    evento.target.value
                                )
                            }
                        >
                            <option value="todos">
                                Todos los supervisores
                            </option>

                            <option value="sin-supervisor">
                                Sin supervisor asignado
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
                    </div>

                    <div className="equipo-page__campo-filtro">
                        <label htmlFor="filtro-sucursal-equipo">
                            Sucursal
                        </label>

                        <select
                            id="filtro-sucursal-equipo"
                            value={
                                filtroSucursal
                            }
                            onChange={(evento) =>
                                setFiltroSucursal(
                                    evento.target.value
                                )
                            }
                        >
                            <option value="todas">
                                Todas las sucursales
                            </option>

                            <option value="sin-sucursal">
                                Sin sucursal asignada
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
                    </div>
                </div>

                <div className="equipo-page__filtros-acciones">
                    <button
                        type="button"
                        onClick={() => {
                            setBusqueda("");
                            setFiltroSucursal(
                                "todas"
                            );
                            setFiltroSupervisor(
                                "todos"
                            );
                        }}
                    >
                        Limpiar filtros
                    </button>
                </div>

                {cargando ? (
                    <div className="equipo-page__estado">
                        Cargando información
                        del equipo...
                    </div>
                ) : empleadosFiltrados.length ===
                    0 ? (
                    <div className="equipo-page__estado">
                        No se encontraron
                        motoristas con los filtros
                        seleccionados.
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

                                    <th aria-label="Acciones" />
                                </tr>
                            </thead>

                            <tbody>
                                {empleadosFiltrados.map(
                                    (empleado) => {
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
                                                        ?.nombre ?? (
                                                        <span className="equipo-page__sin-asignar">
                                                            Sin asignar
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    {empleado
                                                        .empleado
                                                        ?.nombre ?? (
                                                        <span className="equipo-page__sin-asignar">
                                                            Sin asignar
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

                                                        <span>
                                                            {empleado.telefono ||
                                                                "Sin teléfono"}
                                                        </span>
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

                                                            <span>
                                                                {
                                                                    ultimoMarcaje.hora
                                                                }
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="equipo-page__sin-asignar">
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
                                                            En jornada
                                                        </span>
                                                    ) : (
                                                        <span className="equipo-page__estado-jornada equipo-page__estado-jornada--finalizado">
                                                            Fuera de jornada
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

                <p className="equipo-page__resultado">
                    Mostrando{" "}
                    {
                        empleadosFiltrados.length
                    }{" "}
                    de {motoristas.length}{" "}
                    motoristas.
                </p>
            </section>

            {empleadoSeleccionado && (
                <div
                    className="equipo-page__modal-fondo"
                    role="presentation"
                    onMouseDown={(evento) => {
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
                                <p>
                                    Asignación operativa
                                </p>

                                <h2 id="titulo-editar-empleado">
                                    {
                                        empleadoSeleccionado.nombre
                                    }
                                </h2>

                                <span>
                                    {
                                        empleadoSeleccionado.correo
                                    }
                                </span>
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
                                aria-label="Cerrar formulario"
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
                                    onChange={(evento) =>
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
                                    onChange={(evento) =>
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
                                    onChange={(evento) =>
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
                                    onChange={(evento) =>
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
        </main>
    );
}