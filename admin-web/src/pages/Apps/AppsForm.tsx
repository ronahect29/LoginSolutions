import {
    X,
} from "lucide-react";
import {
    type FormEvent,
    useState,
} from "react";

import {
    type AppEntity,
    type UpsertAppDto,
} from "../../services/apps.service";

interface Props {
    initial?: AppEntity;

    onCancel: () => void;

    onSave: (
        data: UpsertAppDto,
        id?: number
    ) => Promise<void>;
}

export function AppsForm({
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
        codigo,
        setCodigo,
    ] = useState(
        initial?.codigo ??
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
        activo,
        setActivo,
    ] = useState(
        initial?.activo ??
            true
    );

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
    // SUBMIT
    // ======================================================

    async function handleSubmit(
        event: FormEvent
    ) {
        event.preventDefault();

        setError(null);

        if (
            !nombre.trim()
        ) {
            setError(
                "Ingresa el nombre de la aplicación."
            );

            return;
        }

        if (
            !codigo.trim()
        ) {
            setError(
                "Ingresa el código técnico."
            );

            return;
        }

        if (
            codigo.trim().length >
            10
        ) {
            setError(
                "El código puede tener un máximo de 10 caracteres."
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
                        codigo
                            .trim()
                            .toUpperCase(),

                    descripcion:
                        descripcion.trim(),

                    activo,
                },

                initial
                    ?.id_aplicacion
            );
        } catch (err) {
            console.error(
                "Error guardando aplicación",
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
                    "No se pudo guardar la aplicación."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="apps-modal-overlay"
            role="dialog"
            aria-modal="true"
        >
            <form
                className="apps-modal"
                onSubmit={
                    handleSubmit
                }
            >
                {/* ======================================================
                    HEADER
                    ====================================================== */}

                <div className="apps-modal-header">
                    <div>
                        <span className="apps-modal-kicker">
                            Gestión de aplicaciones
                        </span>

                        <h2>
                            {initial
                                ? "Editar aplicación"
                                : "Nueva aplicación"}
                        </h2>

                        <p>
                            {initial
                                ? "Actualiza la información de la aplicación registrada."
                                : "Registra una nueva aplicación que será administrada por la plataforma."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="apps-modal-close"
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

                <div className="apps-modal-body">
                    {error && (
                        <div className="apps-form-error">
                            {error}
                        </div>
                    )}

                    <div className="apps-form-grid">
                        <div className="apps-form-field">
                            <label htmlFor="app-name">
                                Nombre de la aplicación
                            </label>

                            <input
                                id="app-name"
                                type="text"
                                maxLength={
                                    100
                                }
                                value={
                                    nombre
                                }
                                placeholder="Ej. Plataforma de Marcajes"
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

                        <div className="apps-form-field">
                            <label htmlFor="app-code">
                                Código técnico
                            </label>

                            <input
                                id="app-code"
                                type="text"
                                maxLength={
                                    10
                                }
                                value={
                                    codigo
                                }
                                placeholder="Ej. PMW"
                                readOnly={
                                    Boolean(
                                        initial
                                    )
                                }
                                onChange={(
                                    event
                                ) =>
                                    setCodigo(
                                        event
                                            .target
                                            .value
                                            .toUpperCase()
                                    )
                                }
                                required
                            />

                            <small>
                                {initial
                                    ? "El código se conserva para evitar afectar las referencias existentes."
                                    : "Identificador interno utilizado por el sistema. Ejemplo: PMW."}
                            </small>
                        </div>

                        <div className="apps-form-field full">
                            <label htmlFor="app-description">
                                Descripción
                            </label>

                            <textarea
                                id="app-description"
                                rows={4}
                                maxLength={
                                    150
                                }
                                value={
                                    descripcion
                                }
                                placeholder="Describe brevemente la finalidad de esta aplicación"
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

                        <div className="apps-form-field">
                            <label htmlFor="app-status">
                                Estado
                            </label>

                            <select
                                id="app-status"
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
                                    Activa
                                </option>

                                <option value="false">
                                    Inactiva
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ======================================================
                    FOOTER
                    ====================================================== */}

                <div className="apps-modal-footer">
                    <button
                        type="button"
                        className="apps-secondary-button"
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
                        className="apps-primary-button"
                        disabled={
                            saving
                        }
                    >
                        {saving
                            ? "Guardando..."
                            : initial
                              ? "Guardar cambios"
                              : "Crear aplicación"}
                    </button>
                </div>
            </form>
        </div>
    );
}