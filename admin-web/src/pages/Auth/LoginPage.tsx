import { type FormEvent, useState } from "react";
import { useSession } from "../../hooks/useSession";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import { getHomeByRoles } from "../../utils/utils";

export function LoginPage() {
    const { login, loading } = useSession();
    const navigate = useNavigate();

    const [email, setEmail] = useState("admin@system.com");
    const [password, setPassword] = useState("123456");
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const usuario = await login(
                email,
                password,
                import.meta.env.VITE_APP_NAME || "PAW"
            );
            // navigate("/");
            const home = getHomeByRoles(usuario.roles);
            navigate(`/admin/${home}`, { replace: true })
        } catch {
            setError("Credenciales inválidas o error de servidor");
        }
    }

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="login-title">
                    Plataforma de Administración
                </h1>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <div className="login-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        autoComplete="username"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="login-field">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        autoComplete="current-password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="login-button"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}
