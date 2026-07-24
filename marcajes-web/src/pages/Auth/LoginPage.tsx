import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LoginPage.css";
import { useSession } from "../../hooks/useSession";

export function LoginPage() {
    const { login, loading } = useSession();
    const navigate = useNavigate();
    const [email, setEmail] = useState("supervisor1@gmail.com");
    const [password, setPassword] = useState("123456");
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        try {
            await login(email, password, import.meta.env.VITE_APP_NAME || "PMW");
            navigate("/colaborador");
        } catch (err: any) {
            console.log("Login error:", err);
            setError("Credenciales inválidas o error de servidor");
        }
    }

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="login-title">Inicio de Sesión</h1>

                {error && <div className="login-error">{error}</div>}

                <div className="login-field">
                    <label className="login-label">Email</label>
                    <input
                        type="email"
                        className="login-input"
                        placeholder="ejemplo@dominio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                    />
                </div>

                <div className="login-field">
                    <label className="login-label">Contraseña</label>
                    <input
                        type="password"
                        className="login-input"
                        value={password}
                        placeholder="contraseña"
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}
