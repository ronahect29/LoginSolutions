import {
    Eye,
    EyeOff,
    KeyRound,
    Save,
    X
} from "lucide-react";

import {
    useState,
    type FormEvent
} from "react";

import axios from "axios";

import {
    api
} from "../../services/api";

import type {
    Usuario
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
            "No fue posible restablecer la contraseña."
        );
    }

    return "Ocurrió un error inesperado.";
}

export function UserPasswordModal({
    user,
    onClose,
    onSaved
}: Props) {
    const [
        password,
        setPassword
    ] =
        useState("");

    const [
        confirmar,
        setConfirmar
    ] =
        useState("");

    const [
        mostrar,
        setMostrar
    ] =
        useState(false);

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

    async function guardar(
        evento:
            FormEvent<HTMLFormElement>
    ) {
        evento.preventDefault();

        setError(null);

        if (
            password.length <
            6
        ) {
            setError(
                "La contraseña debe tener al menos 6 caracteres."
            );
            return;
        }

        if (
            password !==
            confirmar
        ) {
            setError(
                "Las contraseñas no coinciden."
            );
            return;
        }

        setGuardando(
            true
        );

        try {
            await api.patch(
                `/usuarios/resetPassword/${user.id_usuario}`,
                {
                    password
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
                className="user-action-modal compact"
                role="dialog"
                aria-modal="true"
            >
                <header className="user-action-header">
                    <div className="user-action-icon password">
                        <KeyRound
                            size={20}
                        />
                    </div>

                    <div className="user-action-heading">
                        <span>
                            Seguridad
                        </span>

                        <h2>
                            Restablecer contraseña
                        </h2>

                        <p>
                            Define una nueva contraseña para esta cuenta.
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

                        <div className="user-action-field">
                            <label htmlFor="new-password">
                                Nueva contraseña
                            </label>

                            <div className="user-action-password-input">
                                <input
                                    id="new-password"
                                    type={
                                        mostrar
                                            ? "text"
                                            : "password"
                                    }
                                    maxLength={128}
                                    value={
                                        password
                                    }
                                    onChange={(
                                        evento
                                    ) =>
                                        setPassword(
                                            evento
                                                .target
                                                .value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMostrar(
                                            (
                                                actual
                                            ) =>
                                                !actual
                                        )
                                    }
                                    aria-label={
                                        mostrar
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                >
                                    {mostrar ? (
                                        <EyeOff
                                            size={17}
                                        />
                                    ) : (
                                        <Eye
                                            size={17}
                                        />
                                    )}
                                </button>
                            </div>

                            <small>
                                Mínimo 6 caracteres.
                            </small>
                        </div>

                        <div className="user-action-field">
                            <label htmlFor="confirm-password">
                                Confirmar contraseña
                            </label>

                            <input
                                id="confirm-password"
                                type={
                                    mostrar
                                        ? "text"
                                        : "password"
                                }
                                maxLength={128}
                                value={
                                    confirmar
                                }
                                onChange={(
                                    evento
                                ) =>
                                    setConfirmar(
                                        evento
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>

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
                                guardando
                            }
                        >
                            <Save
                                size={16}
                            />

                            {guardando
                                ? "Guardando..."
                                : "Restablecer contraseña"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}