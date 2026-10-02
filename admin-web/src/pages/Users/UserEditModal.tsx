import {
    Pencil,
    Save,
    X
} from "lucide-react";

import {
    useEffect,
    useState,
    type FormEvent
} from "react";

import axios from "axios";

import {
    api
} from "../../services/api";

import type {
    Usuario,
    UsuarioDetalle
} from "../../models/usuario";

import "./styles/user-actions.css";

interface Props {
    user:
        Usuario;

    onClose:
        () => void;

    onSaved:
        () => void;
}

interface Formulario {
    nombre: string;
    correo: string;
    username: string;
    direccion: string;
    telefono: string;
}

function obtenerMensajeError(
    error: unknown
): string {
    if (
        axios.isAxiosError<{
            message?: string;
        }>(error)
    ) {
        return (
            error.response
                ?.data
                ?.message ||
            "No fue posible completar la operación."
        );
    }

    if (
        error instanceof Error
    ) {
        return error.message;
    }

    return "Ocurrió un error inesperado.";
}

export function UserEditModal({
    user,
    onClose,
    onSaved
}: Props) {
    const [
        formulario,
        setFormulario
    ] =
        useState<Formulario>({
            nombre:
                user.nombre,
            correo:
                user.correo,
            username:
                user.usuario,
            direccion:
                "",
            telefono:
                ""
        });

    const [
        cargando,
        setCargando
    ] =
        useState(true);

    const [
        guardando,
        setGuardando
    ] =
        useState(false);

    const [
        error,
        setError
    ] =
        useState<string | null>(
            null
        );

    useEffect(() => {
        let activo =
            true;

        async function cargar() {
            try {
                const respuesta =
                    await api.get<UsuarioDetalle>(
                        `/usuarios/findOne/${user.id_usuario}`
                    );

                if (!activo) {
                    return;
                }

                setFormulario({
                    nombre:
                        respuesta.data
                            .nombre,

                    correo:
                        respuesta.data
                            .correo,

                    username:
                        respuesta.data
                            .username,

                    direccion:
                        respuesta.data
                            .direccion ??
                        "",

                    telefono:
                        respuesta.data
                            .telefono ??
                        ""
                });
            } catch (
                errorPeticion
            ) {
                if (activo) {
                    setError(
                        obtenerMensajeError(
                            errorPeticion
                        )
                    );
                }
            } finally {
                if (activo) {
                    setCargando(
                        false
                    );
                }
            }
        }

        void cargar();

        return () => {
            activo =
                false;
        };
    }, [
        user.id_usuario
    ]);

    function actualizar(
        campo:
            keyof Formulario,
        valor:
            string
    ) {
        setFormulario(
            (
                actual
            ) => ({
                ...actual,
                [campo]:
                    valor
            })
        );
    }

    async function guardar(
        evento:
            FormEvent<HTMLFormElement>
    ) {
        evento.preventDefault();

        setError(null);

        if (
            !formulario.nombre
                .trim()
        ) {
            setError(
                "El nombre es obligatorio."
            );
            return;
        }

        if (
            !formulario.correo
                .trim()
        ) {
            setError(
                "El correo es obligatorio."
            );
            return;
        }

        const correoValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formulario.correo
                    .trim()
            );

        if (
            !correoValido
        ) {
            setError(
                "Ingresa un correo electrónico válido."
            );
            return;
        }

        if (
            !formulario.username
                .trim()
        ) {
            setError(
                "El nombre de usuario es obligatorio."
            );
            return;
        }

        setGuardando(
            true
        );

        try {
            await api.put(
                `/usuarios/update/${user.id_usuario}`,
                {
                    nombre:
                        formulario.nombre
                            .trim(),

                    correo:
                        formulario.correo
                            .trim(),

                    username:
                        formulario.username
                            .trim(),

                    direccion:
                        formulario.direccion
                            .trim() ||
                        null,

                    telefono:
                        formulario.telefono
                            .trim() ||
                        null
                }
            );

            onSaved();
        } catch (
            errorPeticion
        ) {
            setError(
                obtenerMensajeError(
                    errorPeticion
                )
            );
        } finally {
            setGuardando(
                false
            );
        }
    }

    return (
        <div
            className="user-action-overlay"
            onMouseDown={(
                evento
            ) => {
                if (
                    evento.target ===
                    evento.currentTarget &&
                    !guardando
                ) {
                    onClose();
                }
            }}
        >
            <section
                className="user-action-modal"
                role="dialog"
                aria-modal="true"
            >
                <header className="user-action-header">
                    <div className="user-action-icon edit">
                        <Pencil
                            size={20}
                        />
                    </div>

                    <div className="user-action-heading">
                        <span>
                            Gestión de usuario
                        </span>

                        <h2>
                            Editar usuario
                        </h2>

                        <p>
                            Actualiza la información principal de la cuenta.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="user-action-close"
                        onClick={
                            onClose
                        }
                        disabled={
                            guardando
                        }
                        aria-label="Cerrar"
                    >
                        <X
                            size={18}
                        />
                    </button>
                </header>

                <form
                    onSubmit={
                        guardar
                    }
                >
                    <div className="user-action-body">
                        <div className="user-action-user">
                            <strong>
                                {
                                    user.nombre
                                }
                            </strong>

                            <span>
                                {
                                    user.correo
                                }
                            </span>
                        </div>

                        {cargando ? (
                            <div className="user-action-loading">
                                Cargando información...
                            </div>
                        ) : (
                            <div className="user-action-grid">
                                <div className="user-action-field">
                                    <label htmlFor="edit-nombre">
                                        Nombre completo
                                    </label>

                                    <input
                                        id="edit-nombre"
                                        maxLength={75}
                                        value={
                                            formulario.nombre
                                        }
                                        onChange={(
                                            evento
                                        ) =>
                                            actualizar(
                                                "nombre",
                                                evento
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="user-action-field">
                                    <label htmlFor="edit-correo">
                                        Correo electrónico
                                    </label>

                                    <input
                                        id="edit-correo"
                                        type="email"
                                        maxLength={150}
                                        value={
                                            formulario.correo
                                        }
                                        onChange={(
                                            evento
                                        ) =>
                                            actualizar(
                                                "correo",
                                                evento
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="user-action-field">
                                    <label htmlFor="edit-username">
                                        Nombre de usuario
                                    </label>

                                    <input
                                        id="edit-username"
                                        maxLength={50}
                                        value={
                                            formulario.username
                                        }
                                        onChange={(
                                            evento
                                        ) =>
                                            actualizar(
                                                "username",
                                                evento
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="user-action-field">
                                    <label htmlFor="edit-telefono">
                                        Teléfono
                                    </label>

                                    <input
                                        id="edit-telefono"
                                        maxLength={15}
                                        value={
                                            formulario.telefono
                                        }
                                        onChange={(
                                            evento
                                        ) =>
                                            actualizar(
                                                "telefono",
                                                evento
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="user-action-field full">
                                    <label htmlFor="edit-direccion">
                                        Dirección
                                    </label>

                                    <textarea
                                        id="edit-direccion"
                                        rows={3}
                                        maxLength={150}
                                        value={
                                            formulario.direccion
                                        }
                                        onChange={(
                                            evento
                                        ) =>
                                            actualizar(
                                                "direccion",
                                                evento
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="user-action-error">
                                {
                                    error
                                }
                            </div>
                        )}
                    </div>

                    <footer className="user-action-footer">
                        <button
                            type="button"
                            className="user-action-btn secondary"
                            onClick={
                                onClose
                            }
                            disabled={
                                guardando
                            }
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="user-action-btn primary"
                            disabled={
                                cargando ||
                                guardando
                            }
                        >
                            <Save
                                size={16}
                            />

                            {guardando
                                ? "Guardando..."
                                : "Guardar cambios"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}