import {
    type FormEvent,
    useState
} from "react";

import {
    Building2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import {
    useSession
} from "../../hooks/useSession";

import {
    getHomeByRoles
} from "../../utils/utils";

import "../../styles/Login.css";


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
            return "Tu cuenta no tiene acceso a la Plataforma de Administración.";

        case "APP_UNAVAILABLE":
            return "La Plataforma de Administración se encuentra temporalmente deshabilitada.";

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
        return "No tienes acceso a la Plataforma de Administración.";
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
        event:
            FormEvent<HTMLFormElement>
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
            const usuario =
                await login(
                    correo,
                    password,
                    import.meta.env
                        .VITE_APP_NAME ||
                        "PAW"
                );


            const home =
                getHomeByRoles(
                    usuario.roles
                );


            navigate(
                `/admin/${home}`,
                {
                    replace:
                        true
                }
            );
        } catch (
            errorPeticion:
                unknown
        ) {
            const mensaje =
                obtenerMensajeLogin(
                    errorPeticion
                );


            console.error(
                "Login Administración:",
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
        <main className="admin-login-page">

            <div
                className="admin-login-shape admin-login-shape-one"
                aria-hidden="true"
            />

            <div
                className="admin-login-shape admin-login-shape-two"
                aria-hidden="true"
            />

            <div
                className="admin-login-shape admin-login-shape-three"
                aria-hidden="true"
            />


            <section className="admin-login-card">

                <header className="admin-login-header">

                    <div className="admin-login-icon">
                        <Building2
                            size={21}
                            strokeWidth={1.8}
                        />
                    </div>


                    <h1>
                        Plataforma de Administración
                    </h1>


                    <p>
                        Ingresa tus credenciales para continuar.
                    </p>

                </header>


                <form
                    className="admin-login-form"
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                >

                    <div className="admin-login-field">

                        <label htmlFor="admin-email">
                            Correo electrónico
                        </label>


                        <div className="admin-login-input-wrapper">

                            <Mail
                                size={16}
                                strokeWidth={1.8}
                                className="admin-login-input-icon"
                            />


                            <input
                                id="admin-email"
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


                    <div className="admin-login-field">

                        <label htmlFor="admin-password">
                            Contraseña
                        </label>


                        <div className="admin-login-input-wrapper">

                            <LockKeyhole
                                size={16}
                                strokeWidth={1.8}
                                className="admin-login-input-icon"
                            />


                            <input
                                id="admin-password"
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
                                className="admin-login-password-toggle"
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

                                {mostrarPassword ? (
                                    <EyeOff
                                        size={16}
                                        strokeWidth={1.8}
                                    />
                                ) : (
                                    <Eye
                                        size={16}
                                        strokeWidth={1.8}
                                    />
                                )}

                            </button>

                        </div>

                    </div>


                    {error !== "" && (
                        <div
                            className="admin-login-error"
                            role="alert"
                            aria-live="polite"
                        >
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="admin-login-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Ingresando..."
                            : "Entrar"}
                    </button>

                </form>


                <div className="admin-login-security">

                    <ShieldCheck
                        size={14}
                        strokeWidth={1.8}
                    />

                    <span>
                        Conexión segura
                    </span>

                </div>

            </section>

        </main>
    );
}