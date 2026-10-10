import {
    type FormEvent,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "../../styles/LoginPage.css";

import {
    useSession
} from "../../hooks/useSession";


interface ErrorLoginBackend {
    response?: {
        status?: number;

        data?: {
            code?: string;
            message?: string;
        };
    };

    message?: string;
}


function obtenerMensajeLogin(
    error: unknown
): string {
    const errorHttp =
        error as ErrorLoginBackend;

    const codigo =
        errorHttp
            ?.response
            ?.data
            ?.code;

    const mensajeBackend =
        errorHttp
            ?.response
            ?.data
            ?.message;

    const status =
        errorHttp
            ?.response
            ?.status;


    switch (codigo) {
        case "INVALID_CREDENTIALS":
            return "Correo o contraseña incorrectos.";

        case "USER_INACTIVE":
            return "Tu cuenta se encuentra inactiva. Contacta al administrador del sistema.";

        case "APP_ACCESS_DENIED":
            return "Tu cuenta no tiene acceso a la Plataforma de Marcajes.";

        case "APP_UNAVAILABLE":
            return "La Plataforma de Marcajes se encuentra temporalmente deshabilitada.";

        case "PLATFORM_PROFILE_MISSING":
            return "Tu acceso a Marcajes no está completamente configurado. Contacta al administrador.";

        case "PLATFORM_PROFILE_INACTIVE":
            return "Tu perfil de Marcajes se encuentra inactivo. Contacta al administrador.";

        case "AUTH_SERVICE_UNAVAILABLE":
            return "El servicio de autenticación no se encuentra disponible. Intenta nuevamente.";

        case "MISSING_FIELDS":
            return "Ingresa tu correo y contraseña.";
    }


    if (
        typeof mensajeBackend ===
            "string" &&
        mensajeBackend.trim()
    ) {
        return mensajeBackend;
    }


    if (status === 401) {
        return "Correo o contraseña incorrectos.";
    }


    if (status === 403) {
        return "No tienes acceso a la Plataforma de Marcajes.";
    }


    if (
        status &&
        status >= 500
    ) {
        return "No fue posible iniciar sesión. Intenta nuevamente.";
    }


    return "No fue posible iniciar sesión. Intenta nuevamente.";
}


export function LoginPage() {
    const {
        login,
        loading
    } =
        useSession();

    const navigate =
        useNavigate();


    const [
        email,
        setEmail
    ] =
        useState("");


    const [
        password,
        setPassword
    ] =
        useState("");


    const [
        mostrarPassword,
        setMostrarPassword
    ] =
        useState(false);


    const [
        error,
        setError
    ] =
        useState("");


    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        const correo =
            email.trim();


        if (
            !correo ||
            !password
        ) {
            setError(
                "Ingresa tu correo y contraseña."
            );

            return;
        }


        const correoValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !correoValido.test(
                correo
            )
        ) {
            setError(
                "Ingresa un correo electrónico válido."
            );

            return;
        }


        try {
            await login(
                correo,
                password,
                import.meta.env
                    .VITE_APP_NAME ||
                    "PMW"
            );


            navigate(
                "/colaborador"
            );
        } catch (
            errorPeticion: unknown
        ) {
            const mensaje =
                obtenerMensajeLogin(
                    errorPeticion
                );


            console.error(
                "Login Marcajes:",
                errorPeticion
            );


            console.log(
                "Mensaje mostrado al usuario:",
                mensaje
            );


            setError(
                mensaje
            );
        }
    }


    return (
        <main className="mk-login-page">

            <div className="mk-login-decoration mk-login-decoration-one" />

            <div className="mk-login-decoration mk-login-decoration-two" />


            <form
                className="mk-login-card"
                onSubmit={
                    handleSubmit
                }
                noValidate
            >

                <header className="mk-login-header">

                    <div className="mk-login-brand-badge">

                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="8"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M12 7v5l3 2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                    </div>


                    <span className="mk-login-kicker">
                        ACCESO AL SISTEMA
                    </span>


                    <h1>
                        Bienvenido
                    </h1>


                    <p>
                        Ingresa tus credenciales para continuar.
                    </p>

                </header>


                <div className="mk-login-field">

                    <label htmlFor="marcajes-email">
                        Correo electrónico
                    </label>


                    <div className="mk-login-input-wrapper">

                        <span className="mk-login-input-icon">

                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <rect
                                    x="3"
                                    y="5"
                                    width="18"
                                    height="14"
                                    rx="3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />

                                <path
                                    d="m5 7 7 6 7-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                        </span>


                        <input
                            id="marcajes-email"
                            type="email"
                            value={email}
                            placeholder="correo@empresa.com"
                            autoComplete="username"
                            spellCheck={false}
                            disabled={loading}
                            onChange={(
                                event
                            ) => {
                                setEmail(
                                    event.target.value
                                );

                                if (error) {
                                    setError("");
                                }
                            }}
                        />

                    </div>

                </div>


                <div className="mk-login-field">

                    <div className="mk-login-field-heading">

                        <label htmlFor="marcajes-password">
                            Contraseña
                        </label>


                        <span>
                            Acceso seguro
                        </span>

                    </div>


                    <div className="mk-login-input-wrapper">

                        <span className="mk-login-input-icon">

                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <rect
                                    x="5"
                                    y="10"
                                    width="14"
                                    height="10"
                                    rx="3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />

                                <path
                                    d="M8 10V7a4 4 0 0 1 8 0v3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />
                            </svg>

                        </span>


                        <input
                            id="marcajes-password"
                            type={
                                mostrarPassword
                                    ? "text"
                                    : "password"
                            }
                            value={password}
                            placeholder="Ingresa tu contraseña"
                            autoComplete="current-password"
                            disabled={loading}
                            onChange={(
                                event
                            ) => {
                                setPassword(
                                    event.target.value
                                );

                                if (error) {
                                    setError("");
                                }
                            }}
                        />


                        <button
                            type="button"
                            className={
                                mostrarPassword
                                    ? "mk-login-password-toggle visible"
                                    : "mk-login-password-toggle"
                            }
                            onClick={() =>
                                setMostrarPassword(
                                    actual =>
                                        !actual
                                )
                            }
                            disabled={loading}
                            aria-label={
                                mostrarPassword
                                    ? "Ocultar contraseña"
                                    : "Mostrar contraseña"
                            }
                        >

                            {!mostrarPassword ? (
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="m4 4 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M10.5 6.2A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.2 2.8M7.2 7.2C4.2 9 2.5 12 2.5 12s3.5 6 9.5 6a9 9 0 0 0 3.2-.6"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            )}

                        </button>

                    </div>

                </div>


                {error !== "" && (
                    <div
                        className="mk-login-error"
                        role="alert"
                        aria-live="polite"
                    >
                        {error}
                    </div>
                )}


                <button
                    type="submit"
                    className={
                        loading
                            ? "mk-login-button loading"
                            : "mk-login-button"
                    }
                    disabled={loading}
                >

                    {!loading ? (
                        <span className="mk-login-button-content">

                            Iniciar sesión

                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d="M5 12h14M14 7l5 5-5 5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                        </span>
                    ) : (
                        <span className="mk-login-button-content">

                            <span className="mk-login-spinner" />

                            Ingresando...

                        </span>
                    )}

                </button>


                <div className="mk-login-security">

                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M12 22s7-4.3 7-11V5l-7-3-7 3v6c0 6.7 7 11 7 11Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                        />
                    </svg>


                    <span>
                        Conexión segura y protegida
                    </span>

                </div>

            </form>

        </main>
    );
}