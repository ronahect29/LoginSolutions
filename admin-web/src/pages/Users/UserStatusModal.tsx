import {
    UserCheck,
    UserX,
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

    onChanged:
        () => void;
}

function formatearFecha(
    valor?: string | null
): string {
    if (!valor) {
        return "—";
    }

    const fecha =
        new Date(
            valor
        );

    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {
        return valor;
    }

    return new Intl.DateTimeFormat(
        "es-GT",
        {
            day:
                "2-digit",
            month:
                "2-digit",
            year:
                "numeric",
            hour:
                "2-digit",
            minute:
                "2-digit"
        }
    ).format(
        fecha
    );
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
            "No fue posible cambiar el estado del usuario."
        );
    }

    return "Ocurrió un error inesperado.";
}

export function UserStatusModal({
    user,
    onClose,
    onChanged
}: Props) {
    const esBaja =
        user.activo === true;

    const [
        motivo,
        setMotivo
    ] =
        useState("");

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
            esBaja &&
            motivo.trim().length <
                3
        ) {
            setError(
                "Debes indicar el motivo de la baja."
            );
            return;
        }

        setGuardando(
            true
        );

        try {
            await api.patch(
                `/usuarios/changeActivo/${user.id_usuario}`,
                {
                    activo:
                        !esBaja,

                    motivo_baja:
                        esBaja
                            ? motivo.trim()
                            : null
                }
            );

            onChanged();
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
                    <div
                        className={
                            esBaja
                                ? "user-action-icon danger"
                                : "user-action-icon success"
                        }
                    >
                        {esBaja ? (
                            <UserX
                                size={20}
                            />
                        ) : (
                            <UserCheck
                                size={20}
                            />
                        )}
                    </div>

                    <div className="user-action-heading">
                        <span>
                            Estado de la cuenta
                        </span>

                        <h2>
                            {esBaja
                                ? "Dar de baja"
                                : "Reactivar usuario"}
                        </h2>

                        <p>
                            {esBaja
                                ? "La cuenta dejará de tener acceso al sistema."
                                : "La cuenta recuperará el acceso correspondiente a sus roles."}
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

                        {esBaja ? (
                            <>
                                <div className="user-action-notice danger">
                                    El usuario dejará de iniciar sesión y, si pertenece a Marcajes, dejará de aparecer en los listados operativos. Sus marcajes históricos no serán eliminados.
                                </div>

                                <div className="user-action-field">
                                    <label htmlFor="motivo-baja">
                                        Motivo de baja
                                    </label>

                                    <textarea
                                        id="motivo-baja"
                                        rows={4}
                                        maxLength={250}
                                        placeholder="Ejemplo: Finalización de relación laboral"
                                        value={
                                            motivo
                                        }
                                        onChange={(
                                            evento
                                        ) =>
                                            setMotivo(
                                                evento
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                    <small>
                                        {motivo.length}/250 caracteres
                                    </small>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="user-action-notice success">
                                    La cuenta será habilitada nuevamente y el registro operativo de Marcajes será reactivado cuando corresponda.
                                </div>

                                <div className="user-action-history">
                                    <div>
                                        <span>
                                            Fecha de baja
                                        </span>

                                        <strong>
                                            {formatearFecha(
                                                user.fechaBaja
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Motivo registrado
                                        </span>

                                        <strong>
                                            {user.motivoBaja ||
                                                "Sin motivo registrado"}
                                        </strong>
                                    </div>
                                </div>
                            </>
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
                            className={
                                esBaja
                                    ? "user-action-btn danger"
                                    : "user-action-btn success"
                            }
                            disabled={
                                guardando
                            }
                        >
                            {esBaja ? (
                                <UserX
                                    size={16}
                                />
                            ) : (
                                <UserCheck
                                    size={16}
                                />
                            )}

                            {guardando
                                ? "Procesando..."
                                : esBaja
                                    ? "Confirmar baja"
                                    : "Reactivar usuario"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}