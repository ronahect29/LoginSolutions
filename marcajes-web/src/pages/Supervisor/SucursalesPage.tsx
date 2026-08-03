import {
    useEffect,
    useMemo,
    useState,
    type FormEvent
} from "react";
import axios from "axios";

import { api } from "../../services/api";
import { useSession } from "../../hooks/useSession";
import "../../styles/SucursalesPage.css";

import type {
    ActualizarSucursalDto,
    CrearSucursalDto,
    FormularioSucursal,
    RespuestaSucursal,
    SucursalCatalogo
} from "../../models/sucursal";

const formularioInicial: FormularioSucursal = {
    nombre: "",
    telefono: "",
    direccion: "",
    latitud: "",
    longitud: "",
    radio_marcaje_metros: "150",
    activo: true
};

function obtenerMensajeError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const mensaje = error.response?.data?.message;

        if (typeof mensaje === "string") {
            return mensaje;
        }
    }

    return "Ocurrió un error procesando la solicitud.";
}

function convertirCoordenada(valor: string): number | null {
    const valorLimpio = valor.trim();

    if (valorLimpio === "") {
        return null;
    }

    return Number(valorLimpio);
}

export function SucursalesPage() {
    const { empleado } = useSession();

    const [sucursales, setSucursales] = useState<
        SucursalCatalogo[]
    >([]);

    const [busqueda, setBusqueda] = useState("");

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(
        null
    );

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [sucursalEditando, setSucursalEditando] =
        useState<SucursalCatalogo | null>(null);

    const [formulario, setFormulario] =
        useState<FormularioSucursal>(formularioInicial);

    const usuarioAuditoria =
        empleado?.username ||
        empleado?.correo ||
        "sistema";

    useEffect(() => {
        cargarSucursales();
    }, []);

    const sucursalesFiltradas = useMemo(() => {
        const termino = busqueda.trim().toLowerCase();

        if (!termino) {
            return sucursales;
        }

        return sucursales.filter((sucursal) => {
            const telefono =
                sucursal.telefono?.toLowerCase() ?? "";

            return (
                sucursal.nombre
                    .toLowerCase()
                    .includes(termino) ||
                sucursal.direccion
                    .toLowerCase()
                    .includes(termino) ||
                telefono.includes(termino)
            );
        });
    }, [busqueda, sucursales]);

    const totalActivas = useMemo(() => {
        return sucursales.filter(
            (sucursal) => sucursal.activo === true
        ).length;
    }, [sucursales]);

    const totalSinCoordenadas = useMemo(() => {
        return sucursales.filter(
            (sucursal) =>
                sucursal.latitud === null ||
                sucursal.longitud === null
        ).length;
    }, [sucursales]);

    async function cargarSucursales() {
        setCargando(true);
        setError(null);

        try {
            const respuesta =
                await api.get<SucursalCatalogo[]>(
                    "/sucursal/findAll"
                );

            setSucursales(respuesta.data);
        } catch (errorSolicitud) {
            setError(
                obtenerMensajeError(errorSolicitud)
            );
        } finally {
            setCargando(false);
        }
    }

    function abrirFormularioCrear() {
        setSucursalEditando(null);
        setFormulario(formularioInicial);
        setError(null);
        setMensaje(null);
        setMostrarFormulario(true);
    }

    function abrirFormularioEditar(
        sucursal: SucursalCatalogo
    ) {
        setSucursalEditando(sucursal);

        setFormulario({
            nombre: sucursal.nombre,
            telefono: sucursal.telefono ?? "",
            direccion: sucursal.direccion,

            latitud:
                sucursal.latitud !== null
                    ? String(sucursal.latitud)
                    : "",

            longitud:
                sucursal.longitud !== null
                    ? String(sucursal.longitud)
                    : "",

            radio_marcaje_metros: String(
                sucursal.radio_marcaje_metros
            ),

            activo: sucursal.activo === true
        });

        setError(null);
        setMensaje(null);
        setMostrarFormulario(true);
    }

    function cerrarFormulario() {
        if (guardando) {
            return;
        }

        setMostrarFormulario(false);
        setSucursalEditando(null);
        setFormulario(formularioInicial);
    }

    function actualizarCampo<
        K extends keyof FormularioSucursal
    >(
        campo: K,
        valor: FormularioSucursal[K]
    ) {
        setFormulario((formularioActual) => ({
            ...formularioActual,
            [campo]: valor
        }));
    }

    function validarFormulario(): string | null {
        if (!formulario.nombre.trim()) {
            return (
                "El nombre de la sucursal es obligatorio."
            );
        }

        if (!formulario.direccion.trim()) {
            return (
                "La dirección de la sucursal es obligatoria."
            );
        }

        const tieneLatitud =
            formulario.latitud.trim() !== "";

        const tieneLongitud =
            formulario.longitud.trim() !== "";

        if (tieneLatitud !== tieneLongitud) {
            return (
                "Debes ingresar la latitud y la longitud juntas."
            );
        }

        if (
            tieneLatitud &&
            !Number.isFinite(
                Number(formulario.latitud)
            )
        ) {
            return "La latitud ingresada no es válida.";
        }

        if (
            tieneLongitud &&
            !Number.isFinite(
                Number(formulario.longitud)
            )
        ) {
            return "La longitud ingresada no es válida.";
        }

        if (
            tieneLatitud &&
            (
                Number(formulario.latitud) < -90 ||
                Number(formulario.latitud) > 90
            )
        ) {
            return (
                "La latitud debe estar entre -90 y 90."
            );
        }

        if (
            tieneLongitud &&
            (
                Number(formulario.longitud) < -180 ||
                Number(formulario.longitud) > 180
            )
        ) {
            return (
                "La longitud debe estar entre -180 y 180."
            );
        }

        const radio = Number(
            formulario.radio_marcaje_metros
        );

        if (!Number.isInteger(radio)) {
            return (
                "El radio de marcaje debe ser un número entero."
            );
        }

        if (radio < 10 || radio > 5000) {
            return (
                "El radio debe estar entre 10 y 5000 metros."
            );
        }

        return null;
    }

    async function guardarSucursal(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const errorValidacion = validarFormulario();

        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        setGuardando(true);
        setError(null);
        setMensaje(null);

        const latitud = convertirCoordenada(
            formulario.latitud
        );

        const longitud = convertirCoordenada(
            formulario.longitud
        );

        try {
            if (sucursalEditando) {
                const datos: ActualizarSucursalDto = {
                    nombre: formulario.nombre.trim(),

                    telefono:
                        formulario.telefono.trim() ||
                        null,

                    direccion:
                        formulario.direccion.trim(),

                    latitud,
                    longitud,

                    radio_marcaje_metros: Number(
                        formulario.radio_marcaje_metros
                    ),

                    activo: formulario.activo,
                    modificador: usuarioAuditoria
                };

                const respuesta =
                    await api.put<RespuestaSucursal>(
                        `/sucursal/update/${sucursalEditando.id_sucursal}`,
                        datos
                    );

                setMensaje(respuesta.data.message);
            } else {
                const datos: CrearSucursalDto = {
                    nombre: formulario.nombre.trim(),

                    telefono:
                        formulario.telefono.trim() ||
                        null,

                    direccion:
                        formulario.direccion.trim(),

                    latitud,
                    longitud,

                    radio_marcaje_metros: Number(
                        formulario.radio_marcaje_metros
                    ),

                    activo: formulario.activo,
                    creador: usuarioAuditoria
                };

                const respuesta =
                    await api.post<RespuestaSucursal>(
                        "/sucursal/create",
                        datos
                    );

                setMensaje(respuesta.data.message);
            }

            await cargarSucursales();

            setMostrarFormulario(false);
            setSucursalEditando(null);
            setFormulario(formularioInicial);
        } catch (errorSolicitud) {
            setError(
                obtenerMensajeError(errorSolicitud)
            );
        } finally {
            setGuardando(false);
        }
    }

    async function cambiarEstado(
        sucursal: SucursalCatalogo
    ) {
        const nuevoEstado =
            sucursal.activo !== true;

        const accion = nuevoEstado
            ? "activar"
            : "desactivar";

        const confirmado = window.confirm(
            `¿Deseas ${accion} la sucursal "${sucursal.nombre}"?`
        );

        if (!confirmado) {
            return;
        }

        setError(null);
        setMensaje(null);

        try {
            const respuesta =
                await api.patch<RespuestaSucursal>(
                    `/sucursal/changeStatus/${sucursal.id_sucursal}`,
                    {
                        activo: nuevoEstado,
                        modificador: usuarioAuditoria
                    }
                );

            setMensaje(respuesta.data.message);

            await cargarSucursales();
        } catch (errorSolicitud) {
            setError(
                obtenerMensajeError(errorSolicitud)
            );
        }
    }

    return (
        <main className="sucursales-page">
            <section className="sucursales-header">
                <div>
                    <span className="sucursales-eyebrow">
                        Configuración operativa
                    </span>

                    <h1>Catálogo de sucursales</h1>

                    <p>
                        Administra las ubicaciones
                        autorizadas para el registro de
                        entrada y salida de los motoristas.
                    </p>
                </div>

                <button
                    type="button"
                    className="sucursales-btn-primary"
                    onClick={abrirFormularioCrear}
                >
                    <span aria-hidden="true">＋</span>
                    Nueva sucursal
                </button>
            </section>

            <section className="sucursales-summary">
                <article className="sucursales-summary-card">
                    <span>Total de sucursales</span>
                    <strong>{sucursales.length}</strong>
                </article>

                <article className="sucursales-summary-card">
                    <span>Sucursales activas</span>
                    <strong>{totalActivas}</strong>
                </article>

                <article className="sucursales-summary-card">
                    <span>Sin coordenadas</span>
                    <strong>
                        {totalSinCoordenadas}
                    </strong>
                </article>
            </section>

            {mensaje && (
                <div
                    className="sucursales-alert sucursales-alert-success"
                    role="status"
                >
                    {mensaje}
                </div>
            )}

            {error && (
                <div
                    className="sucursales-alert sucursales-alert-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <section className="sucursales-content">
                <div className="sucursales-toolbar">
                    <div className="sucursales-search">
                        <span aria-hidden="true">
                            ⌕
                        </span>

                        <input
                            type="search"
                            value={busqueda}
                            onChange={(event) =>
                                setBusqueda(
                                    event.target.value
                                )
                            }
                            placeholder="Buscar por nombre, dirección o teléfono"
                            aria-label="Buscar sucursales"
                        />
                    </div>

                    <span className="sucursales-results">
                        {sucursalesFiltradas.length}{" "}
                        resultado(s)
                    </span>
                </div>

                <div className="sucursales-table-wrapper">
                    <table className="sucursales-table">
                        <thead>
                            <tr>
                                <th>Sucursal</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Ubicación</th>
                                <th>Radio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="sucursales-empty"
                                    >
                                        Cargando
                                        sucursales...
                                    </td>
                                </tr>
                            ) : sucursalesFiltradas.length ===
                              0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="sucursales-empty"
                                    >
                                        No se encontraron
                                        sucursales.
                                    </td>
                                </tr>
                            ) : (
                                sucursalesFiltradas.map(
                                    (sucursal) => (
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

                                                    <small>
                                                        ID:{" "}
                                                        {
                                                            sucursal.id_sucursal
                                                        }
                                                    </small>
                                                </div>
                                            </td>

                                            <td>
                                                {
                                                    sucursal.direccion
                                                }
                                            </td>

                                            <td>
                                                {sucursal.telefono ||
                                                    "Sin teléfono"}
                                            </td>

                                            <td>
                                                {sucursal.latitud !==
                                                    null &&
                                                sucursal.longitud !==
                                                    null ? (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${sucursal.latitud},${sucursal.longitud}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="sucursales-map-link"
                                                    >
                                                        Ver mapa
                                                    </a>
                                                ) : (
                                                    <span className="sucursales-pending">
                                                        Pendiente
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    sucursal.radio_marcaje_metros
                                                }{" "}
                                                m
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
                                                            cambiarEstado(
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
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {mostrarFormulario && (
                <div
                    className="sucursales-modal-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            cerrarFormulario();
                        }
                    }}
                >
                    <section
                        className="sucursales-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sucursales-modal-title"
                    >
                        <div className="sucursales-modal-header">
                            <div>
                                <span>
                                    {sucursalEditando
                                        ? "Editar ubicación"
                                        : "Nueva ubicación"}
                                </span>

                                <h2 id="sucursales-modal-title">
                                    {sucursalEditando
                                        ? "Actualizar sucursal"
                                        : "Registrar sucursal"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="sucursales-modal-close"
                                onClick={cerrarFormulario}
                                aria-label="Cerrar formulario"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            className="sucursales-form"
                            onSubmit={guardarSucursal}
                        >
                            <div className="sucursales-field sucursales-field-full">
                                <label htmlFor="sucursal-nombre">
                                    Nombre
                                </label>

                                <input
                                    id="sucursal-nombre"
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
                                <label htmlFor="sucursal-direccion">
                                    Dirección
                                </label>

                                <textarea
                                    id="sucursal-direccion"
                                    maxLength={200}
                                    rows={3}
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
                                <label htmlFor="sucursal-telefono">
                                    Teléfono
                                </label>

                                <input
                                    id="sucursal-telefono"
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
                                    placeholder="23203434"
                                />
                            </div>

                            <div className="sucursales-field">
                                <label htmlFor="sucursal-radio">
                                    Radio permitido
                                </label>

                                <div className="sucursales-input-suffix">
                                    <input
                                        id="sucursal-radio"
                                        type="number"
                                        min={10}
                                        max={5000}
                                        step={1}
                                        value={
                                            formulario.radio_marcaje_metros
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

                                    <span>metros</span>
                                </div>
                            </div>

                            <div className="sucursales-field">
                                <label htmlFor="sucursal-latitud">
                                    Latitud
                                </label>

                                <input
                                    id="sucursal-latitud"
                                    type="number"
                                    min={-90}
                                    max={90}
                                    step="0.000001"
                                    value={
                                        formulario.latitud
                                    }
                                    onChange={(event) =>
                                        actualizarCampo(
                                            "latitud",
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="14.634915"
                                />
                            </div>

                            <div className="sucursales-field">
                                <label htmlFor="sucursal-longitud">
                                    Longitud
                                </label>

                                <input
                                    id="sucursal-longitud"
                                    type="number"
                                    min={-180}
                                    max={180}
                                    step="0.000001"
                                    value={
                                        formulario.longitud
                                    }
                                    onChange={(event) =>
                                        actualizarCampo(
                                            "longitud",
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="-90.506882"
                                />
                            </div>

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
                                        asignaciones y filtros.
                                    </small>
                                </span>
                            </label>

                            <div className="sucursales-form-actions">
                                <button
                                    type="button"
                                    className="sucursales-btn-secondary"
                                    onClick={
                                        cerrarFormulario
                                    }
                                    disabled={guardando}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="sucursales-btn-primary"
                                    disabled={guardando}
                                >
                                    {guardando
                                        ? "Guardando..."
                                        : sucursalEditando
                                          ? "Guardar cambios"
                                          : "Registrar sucursal"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}