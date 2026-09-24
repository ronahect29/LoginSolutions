import {
    X,
} from "lucide-react";
import {
    type FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { FiltroAplicacion } from "../../models/FiltroAplicacion";
import { api } from "../../services/api";
import {
    type Role,
    type UpsertRoleDto,
} from "../../services/roles.service";

interface Props {
    initial?: Role;
    onCancel: () => void;

    onSave: (
        data: UpsertRoleDto,
        id?: number
    ) => Promise<void>;
}

// ======================================================
// GENERACIÓN DE CÓDIGO
// ======================================================

function generarPrefijoRol(
    nombre: string
): string {
    const limpio =
        nombre
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /[^a-zA-Z0-9 ]/g,
                " "
            )
            .trim()
            .toUpperCase();

    if (!limpio) {
        return "";
    }

    const palabras =
        limpio
            .split(/\s+/)
            .filter(Boolean);

    if (
        palabras.length === 1
    ) {
        return palabras[0]
            .slice(
                0,
                3
            );
    }

    return palabras
        .map(
            (palabra) =>
                palabra.charAt(0)
        )
        .join("")
        .slice(
            0,
            3
        );
}

function generarCodigoRol(
    nombre: string,
    codigoAplicacion: string
): string {
    const prefijo =
        generarPrefijoRol(
            nombre
        );

    const aplicacion =
        codigoAplicacion
            .trim()
            .toUpperCase();

    if (
        !prefijo ||
        !aplicacion
    ) {
        return "";
    }

    return `${prefijo}-${aplicacion}`
        .slice(
            0,
            10
        );
}

export function RoleForm({
    initial,
    onCancel,
    onSave,
}: Props) {
    const [
        nombre,
        setNombre,
    ] = useState(
        initial?.nombre ??
            ""
    );

    const [
        descripcion,
        setDescripcion,
    ] = useState(
        initial?.descripcion ??
            ""
    );

    const [
        aplicacionId,
        setAplicacionId,
    ] = useState(
        initial?.aplicacion
            .id_aplicacion ??
            0
    );

    const [
        activo,
        setActivo,
    ] = useState(
        initial?.activo ??
            true
    );

    const [
        aplicaciones,
        setAplicaciones,
    ] =
        useState<
            FiltroAplicacion[]
        >([]);

    const [
        loadingApps,
        setLoadingApps,
    ] =
        useState(true);

    const [
        saving,
        setSaving,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState<
            string | null
        >(null);

    // ======================================================
    // APLICACIONES
    // ======================================================

    useEffect(() => {
        async function loadApps() {
            setLoadingApps(
                true
            );

            try {
                const res =
                    await api.get<
                        FiltroAplicacion[]
                    >(
                        "/aplicacion/findByActivo/true"
                    );

                let opciones =
                    res.data;

                if (
                    initial &&
                    !opciones.some(
                        (app) =>
                            app.id_aplicacion ===
                            initial
                                .aplicacion
                                .id_aplicacion
                    )
                ) {
                    opciones = [
                        ...opciones,
                        {
                            id_aplicacion:
                                initial
                                    .aplicacion
                                    .id_aplicacion,

                            nombre:
                                initial
                                    .aplicacion
                                    .nombre,

                            codigo:
                                initial
                                    .aplicacion
                                    .codigo,
                        },
                    ];
                }

                setAplicaciones(
                    opciones
                );
            } catch (err) {
                console.error(
                    "Error cargando aplicaciones",
                    err
                );

                setError(
                    "No se pudieron cargar las aplicaciones."
                );
            } finally {
                setLoadingApps(
                    false
                );
            }
        }

        void loadApps();
    }, [initial]);

    // ======================================================
    // APLICACIÓN SELECCIONADA
    // ======================================================

    const aplicacionSeleccionada =
        useMemo(
            () =>
                aplicaciones.find(
                    (app) =>
                        app.id_aplicacion ===
                        aplicacionId
                ) || null,
            [
                aplicaciones,
                aplicacionId,
            ]
        );

    // ======================================================
    // CÓDIGO TÉCNICO
    // ======================================================

    const codigo =
        useMemo(
            () => {
                if (initial) {
                    return initial.codigo;
                }

                return generarCodigoRol(
                    nombre,
                    aplicacionSeleccionada
                        ?.codigo ??
                        ""
                );
            },
            [
                initial,
                nombre,
                aplicacionSeleccionada,
            ]
        );

    // ======================================================
    // SUBMIT
    // ======================================================

    async function handleSubmit(
        event: FormEvent
    ) {
        event.preventDefault();

        setError(null);

        if (
            aplicacionId <= 0
        ) {
            setError(
                "Selecciona una aplicación."
            );

            return;
        }

        if (
            !nombre.trim()
        ) {
            setError(
                "Ingresa el nombre del rol."
            );

            return;
        }

        if (
            !codigo.trim()
        ) {
            setError(
                "No se pudo generar el código técnico."
            );

            return;
        }

        if (
            codigo.length >
            10
        ) {
            setError(
                "El código técnico no puede superar 10 caracteres."
            );

            return;
        }

        if (
            !descripcion.trim()
        ) {
            setError(
                "Ingresa una descripción."
            );

            return;
        }

        setSaving(true);

        try {
            await onSave(
                {
                    nombre:
                        nombre.trim(),

                    codigo:
                        codigo.trim(),

                    descripcion:
                        descripcion.trim(),

                    activo,

                    id_aplicacion:
                        aplicacionId,
                },
                initial?.id_rol
            );
        } catch (err) {
            console.error(
                "Error guardando rol",
                err
            );

            const message =
                (
                    err as {
                        response?: {
                            data?: {
                                message?: string;
                            };
                        };
                    }
                ).response?.data
                    ?.message;

            setError(
                message ||
                    "No se pudo guardar el rol."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="roles-modal-overlay"
            role="dialog"
            aria-modal="true"
        >
            <form
                className="roles-modal"
                onSubmit={
                    handleSubmit
                }
            >
                {/* ======================================================
                    HEADER
                    ====================================================== */}

                <div className="roles-modal-header">
                    <div>
                        <span className="roles-modal-kicker">
                            Gestión de roles
                        </span>

                        <h2>
                            {initial
                                ? "Editar rol"
                                : "Nuevo rol"}
                        </h2>

                        <p>
                            {initial
                                ? "Actualiza la información del perfil de acceso."
                                : "Selecciona una aplicación y define el nuevo perfil de acceso."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="roles-modal-close"
                        onClick={
                            onCancel
                        }
                        aria-label="Cerrar"
                    >
                        <X
                            size={
                                20
                            }
                        />
                    </button>
                </div>

                {/* ======================================================
                    BODY
                    ====================================================== */}

                <div className="roles-modal-body">
                    {error && (
                        <div className="roles-form-error">
                            {error}
                        </div>
                    )}

                    <div className="roles-form-grid">
                        {/* ======================================================
                            APLICACIÓN
                            ====================================================== */}

                        <div className="roles-form-field full">
                            <label htmlFor="role-app">
                                Aplicación asociada
                            </label>

                            <select
                                id="role-app"
                                value={
                                    aplicacionId
                                }
                                disabled={
                                    loadingApps
                                }
                                onChange={(
                                    event
                                ) =>
                                    setAplicacionId(
                                        Number(
                                            event
                                                .target
                                                .value
                                        )
                                    )
                                }
                                required
                            >
                                <option value={0}>
                                    {loadingApps
                                        ? "Cargando aplicaciones..."
                                        : "Selecciona una aplicación"}
                                </option>

                                {aplicaciones.map(
                                    (
                                        app
                                    ) => (
                                        <option
                                            key={
                                                app.id_aplicacion
                                            }
                                            value={
                                                app.id_aplicacion
                                            }
                                        >
                                            {
                                                app.nombre
                                            }{" "}
                                            ({
                                                app.codigo
                                            })
                                        </option>
                                    )
                                )}
                            </select>

                            <small>
                                El rol quedará
                                disponible para
                                los usuarios de
                                esta aplicación.
                            </small>
                        </div>

                        {/* ======================================================
                            NOMBRE
                            ====================================================== */}

                        <div className="roles-form-field">
                            <label htmlFor="role-name">
                                Nombre del rol
                            </label>

                            <input
                                id="role-name"
                                type="text"
                                maxLength={
                                    50
                                }
                                value={
                                    nombre
                                }
                                placeholder="Ej. Supervisor"
                                onChange={(
                                    event
                                ) =>
                                    setNombre(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                required
                            />
                        </div>

                        {/* ======================================================
                            CÓDIGO AUTOMÁTICO
                            ====================================================== */}

                        <div className="roles-form-field">
                            <label htmlFor="role-code">
                                Código técnico
                            </label>

                            <input
                                id="role-code"
                                type="text"
                                value={
                                    codigo
                                }
                                placeholder="Se genera automáticamente"
                                readOnly
                            />

                            <small>
                                {initial
                                    ? "El código técnico existente se conserva para evitar afectar referencias del sistema."
                                    : "Se genera automáticamente según el nombre del rol y la aplicación seleccionada."}
                            </small>
                        </div>

                        {/* ======================================================
                            DESCRIPCIÓN
                            ====================================================== */}

                        <div className="roles-form-field full">
                            <label htmlFor="role-description">
                                Descripción
                            </label>

                            <textarea
                                id="role-description"
                                rows={4}
                                maxLength={
                                    150
                                }
                                value={
                                    descripcion
                                }
                                placeholder="Describe brevemente las funciones de este rol"
                                onChange={(
                                    event
                                ) =>
                                    setDescripcion(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                required
                            />

                            <small>
                                {
                                    descripcion.length
                                }
                                /150
                            </small>
                        </div>

                        {/* ======================================================
                            ESTADO
                            ====================================================== */}

                        <div className="roles-form-field">
                            <label htmlFor="role-status">
                                Estado
                            </label>

                            <select
                                id="role-status"
                                value={
                                    activo
                                        ? "true"
                                        : "false"
                                }
                                onChange={(
                                    event
                                ) =>
                                    setActivo(
                                        event
                                            .target
                                            .value ===
                                            "true"
                                    )
                                }
                            >
                                <option value="true">
                                    Activo
                                </option>

                                <option value="false">
                                    Inactivo
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ======================================================
                    FOOTER
                    ====================================================== */}

                <div className="roles-modal-footer">
                    <button
                        type="button"
                        className="roles-secondary-button"
                        onClick={
                            onCancel
                        }
                        disabled={
                            saving
                        }
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="roles-primary-button"
                        disabled={
                            saving ||
                            loadingApps
                        }
                    >
                        {saving
                            ? "Guardando..."
                            : initial
                              ? "Guardar cambios"
                              : "Crear rol"}
                    </button>
                </div>
            </form>
        </div>
    );
}