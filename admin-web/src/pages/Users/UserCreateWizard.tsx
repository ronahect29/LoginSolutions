import {
    X,
} from "lucide-react";
import {
    useState,
} from "react";

import type {
    FiltroAplicacion,
} from "../../models/FiltroAplicacion";
import type {
    FiltroRol,
    RolConfigUsuario,
} from "../../models/FiltroRol";
import {
    api,
} from "../../services/api";
import "./styles/user-wizard.css";
import {
    StepUserBasic,
} from "./wizard/StepUserBasic";
import {
    StepUserRoles,
} from "./wizard/StepUserRoles";
import {
    StepUserSummary,
} from "./wizard/StepUserSummary";

interface Props {
    appsOptions:
        FiltroAplicacion[];

    onClose:
        () => void;

    onCreated:
        () => void;
}

type UserDraft = {
    correo: string;
    nombre: string;
    username: string;
    password: string;
    direccion: string;
    telefono: string;
};

const STEP_TITLES = [
    "Información Básica",
    "Configuración de Rol",
    "Resumen",
];

export function UserCreateWizard({
    appsOptions,
    onClose,
    onCreated,
}: Props) {
    const [
        step,
        setStep,
    ] = useState(1);

    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    );

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        user,
        setUser,
    ] = useState<UserDraft>({
        correo: "",
        nombre: "",
        username: "",
        password: "",
        direccion: "",
        telefono: "",
    });

    const [
        selectedApps,
        setSelectedApps,
    ] = useState<
        FiltroAplicacion[]
    >([]);

    const [
        rolesOptions,
        setRolesOptions,
    ] = useState<
        RolConfigUsuario[]
    >([]);

    const [
        selectedRoles,
        setSelectedRoles,
    ] = useState<
        RolConfigUsuario[]
    >([]);

    async function fetchRolesForApps(
        apps: FiltroAplicacion[]
    ) {
        setSelectedApps(
            apps
        );

        setSelectedRoles(
            []
        );

        if (
            apps.length === 0
        ) {
            setRolesOptions(
                []
            );

            return;
        }

        try {
            const res =
                await api.post<
                    FiltroRol[]
                >(
                    "/rol/findByActivoAndCodigosAplicacionActivo",
                    {
                        activo: true,

                        appsCodes:
                            apps.map(
                                (app) =>
                                    app.codigo
                            ),
                    }
                );

            setRolesOptions(
                res.data.map(
                    (role) => ({
                        id_rol:
                            role.id_rol,

                        nombre:
                            role.nombre,

                        codigo:
                            role.codigo,

                        default:
                            false,
                    })
                )
            );
        } catch (
            err
        ) {
            console.error(
                "Error cargando roles",
                err
            );

            setError(
                "No fue posible cargar los roles de las aplicaciones seleccionadas."
            );
        }
    }

    function handleDefaultRoleChange(
        roleCode: string
    ) {
        setSelectedRoles(
            (prev) =>
                prev.map(
                    (role) => ({
                        ...role,

                        default:
                            role.codigo ===
                            roleCode,
                    })
                )
        );
    }

    function validarPasoActual():
        boolean {
        setError(
            null
        );

        if (
            step === 1
        ) {
            if (
                !user.nombre.trim()
            ) {
                setError(
                    "Ingresa el nombre completo del usuario."
                );

                return false;
            }

            if (
                !user.correo.trim()
            ) {
                setError(
                    "Ingresa el correo electrónico."
                );

                return false;
            }

            const correoValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !correoValido.test(
                    user.correo.trim()
                )
            ) {
                setError(
                    "Ingresa un correo electrónico válido."
                );

                return false;
            }

            if (
                !user.username.trim()
            ) {
                setError(
                    "Ingresa un nombre de usuario."
                );

                return false;
            }

            if (
                user.password.length <
                6
            ) {
                setError(
                    "La contraseña debe tener al menos 6 caracteres."
                );

                return false;
            }
        }

        if (
            step === 2
        ) {
            if (
                selectedApps.length ===
                0
            ) {
                setError(
                    "Selecciona al menos una aplicación."
                );

                return false;
            }

            if (
                selectedRoles.length ===
                0
            ) {
                setError(
                    "Selecciona al menos un rol."
                );

                return false;
            }

            if (
                !selectedRoles.some(
                    (role) =>
                        role.default
                )
            ) {
                setError(
                    "Selecciona un rol principal."
                );

                return false;
            }
        }

        return true;
    }

    function handleNext() {
        if (
            !validarPasoActual()
        ) {
            return;
        }

        setStep(
            (current) =>
                current + 1
        );

        setError(
            null
        );
    }

    function handleBack() {
        setStep(
            (current) =>
                current - 1
        );

        setError(
            null
        );
    }

    async function handleFinish() {
        setError(
            null
        );

        const ok =
            window.confirm(
                "¿Confirmas el registro del nuevo usuario?"
            );

        if (
            !ok
        ) {
            return;
        }

        try {
            setSaving(
                true
            );

            await api.post(
                "/usuarios/create",
                {
                    user: {
                        ...user,

                        nombre:
                            user.nombre.trim(),

                        correo:
                            user.correo.trim(),

                        username:
                            user.username.trim(),

                        direccion:
                            user.direccion.trim(),

                        telefono:
                            user.telefono.trim(),
                    },

                    roles:
                        selectedRoles.map(
                            (role) => ({
                                id_rol:
                                    role.id_rol,

                                codigo:
                                    role.codigo,

                                default:
                                    role.default,
                            })
                        ),
                }
            );

            onCreated();
        } catch (
            err: any
        ) {
            console.error(
                "Error creando usuario",
                err
            );

            setError(
                err?.response
                    ?.data
                    ?.message ??
                    "No se pudo registrar el usuario."
            );
        } finally {
            setSaving(
                false
            );
        }
    }

    return (
        <div
            className="uw-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="uw-title"
        >
            <div className="uw-card">
                <div className="uw-header">
                    <div className="uw-header-top">
                        <div>
                            <span className="uw-kicker">
                                Nuevo usuario
                            </span>

                            <h2
                                id="uw-title"
                                className="uw-title"
                            >
                                {
                                    STEP_TITLES[
                                        step - 1
                                    ]
                                }
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="uw-close"
                            onClick={
                                onClose
                            }
                            aria-label="Cerrar"
                        >
                            <X
                                size={20}
                            />
                        </button>
                    </div>

                    <div className="uw-progress">
                        {STEP_TITLES.map(
                            (
                                title,
                                index
                            ) => {
                                const current =
                                    index +
                                    1;

                                const state =
                                    step ===
                                    current
                                        ? "active"
                                        : step >
                                            current
                                          ? "done"
                                          : "";

                                return (
                                    <div
                                        key={
                                            title
                                        }
                                        className={`uw-progress-step ${state}`}
                                    >
                                        <span className="uw-progress-number">
                                            {
                                                current
                                            }
                                        </span>

                                        <span>
                                            {
                                                title
                                            }
                                        </span>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                <div className="uw-body">
                    {error && (
                        <div className="uw-error">
                            {
                                error
                            }
                        </div>
                    )}

                    {step === 1 && (
                        <StepUserBasic
                            data={
                                user
                            }
                            onChange={
                                setUser
                            }
                        />
                    )}

                    {step === 2 && (
                        <StepUserRoles
                            appsOptions={
                                appsOptions
                            }
                            rolesOptions={
                                rolesOptions
                            }
                            selectedApps={
                                selectedApps
                            }
                            selectedRoles={
                                selectedRoles
                            }
                            onAppsChange={
                                fetchRolesForApps
                            }
                            onRolesChange={(
                                roles
                            ) => {
                                let next =
                                    roles;

                                if (
                                    next.length >
                                        0 &&
                                    !next.some(
                                        (
                                            role
                                        ) =>
                                            role.default
                                    )
                                ) {
                                    next =
                                        next.map(
                                            (
                                                role,
                                                index
                                            ) => ({
                                                ...role,

                                                default:
                                                    index ===
                                                    0,
                                            })
                                        );
                                }

                                setSelectedRoles(
                                    next
                                );
                            }}
                            onDefaultRoleChange={
                                handleDefaultRoleChange
                            }
                        />
                    )}

                    {step === 3 && (
                        <StepUserSummary
                            user={
                                user
                            }
                            apps={
                                selectedApps
                            }
                            roles={
                                selectedRoles
                            }
                        />
                    )}
                </div>

                <div className="uw-footer">
                    <button
                        type="button"
                        className="uw-btn ghost"
                        onClick={
                            onClose
                        }
                        disabled={
                            saving
                        }
                    >
                        Cancelar
                    </button>

                    <div className="uw-footer-right">
                        {step > 1 && (
                            <button
                                type="button"
                                className="uw-btn secondary"
                                onClick={
                                    handleBack
                                }
                                disabled={
                                    saving
                                }
                            >
                                Atrás
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                className="uw-btn primary"
                                onClick={
                                    handleNext
                                }
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="uw-btn primary"
                                onClick={
                                    handleFinish
                                }
                                disabled={
                                    saving
                                }
                            >
                                {saving
                                    ? "Registrando..."
                                    : "Crear usuario"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}