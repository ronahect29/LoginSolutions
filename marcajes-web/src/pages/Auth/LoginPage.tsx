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


export function LoginPage() {
    const {
        login,
        loading
    } =
        useSession();

    const navigate =
        useNavigate();


    // ======================================================
    // DATOS DEL FORMULARIO
    // ======================================================

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


    // ======================================================
    // LOGIN
    // ======================================================

    async function handleSubmit(
        event:
            FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");


        if (
            !email.trim() ||
            !password
        ) {
            setError(
                "Ingresa tu correo y contraseña."
            );

            return;
        }


        try {
            await login(
                email.trim(),
                password,
                import.meta.env
                    .VITE_APP_NAME ||
                    "PMW"
            );


            navigate(
                "/colaborador"
            );
        } catch (
            err:
                any
        ) {
            console.error(
                "Login error:",
                err
            );


            const mensaje =
                err?.response
                    ?.data
                    ?.message;


            setError(
                mensaje ||
                "Credenciales inválidas o no tienes acceso a esta plataforma."
            );
        }
    }


    // ======================================================
    // UI
    // ======================================================

    return (
        <main className="mk-login-page">

            {/* ==============================================
                DECORACIÓN DE FONDO
                ============================================== */}

            <div className="mk-login-decoration mk-login-decoration-one" />

            <div className="mk-login-decoration mk-login-decoration-two" />


            {/* ==============================================
                TARJETA
                ============================================== */}

            <form
                className="mk-login-card"
                onSubmit={
                    handleSubmit
                }
            >

                {/* ==========================================
                    ENCABEZADO
                    ========================================== */}

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


                {/* ==========================================
                    CORREO
                    ========================================== */}

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
                            value={
                                email
                            }
                            placeholder="correo@empresa.com"
                            autoComplete="username"
                            onChange={(
                                event
                            ) =>
                                setEmail(
                                    event
                                        .target
                                        .value
                                )
                            }
                            disabled={
                                loading
                            }
                            required
                        />

                    </div>

                </div>


                {/* ==========================================
                    CONTRASEÑA
                    ========================================== */}

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
                            value={
                                password
                            }
                            placeholder="Ingresa tu contraseña"
                            autoComplete="current-password"
                            onChange={(
                                event
                            ) =>
                                setPassword(
                                    event
                                        .target
                                        .value
                                )
                            }
                            disabled={
                                loading
                            }
                            required
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
                                    (
                                        actual
                                    ) =>
                                        !actual
                                )
                            }
                            disabled={
                                loading
                            }
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


                {/* ==========================================
                    ERROR
                    ========================================== */}

                {error && (
                    <div className="mk-login-error">
                        {error}
                    </div>
                )}


                {/* ==========================================
                    BOTÓN
                    ========================================== */}

                <button
                    type="submit"
                    className={
                        loading
                            ? "mk-login-button loading"
                            : "mk-login-button"
                    }
                    disabled={
                        loading
                    }
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


                {/* ==========================================
                    SEGURIDAD
                    ========================================== */}

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