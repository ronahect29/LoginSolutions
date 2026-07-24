import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { api } from "../services/api";
import { type AuthUsuario } from "../models/usuario";
import { type Rol } from "../models/rol";
import { ES_LOCAL, isTokenExpired } from "../utils/utils";
import { useNavigate } from "react-router-dom";

interface SessionContextValue {
    usuario: AuthUsuario | null;
    token: string | null;
    loading: boolean;
    login: (correo: string, password: string, app: string) => Promise<AuthUsuario>;
    logout: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<AuthUsuario | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        function onSessionExpired() {
            logout();
            navigate("/admin/login", { replace: true });
        }

        window.addEventListener("session-expired", onSessionExpired);
        return () => {
            window.removeEventListener("session-expired", onSessionExpired);
        };
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token_admin");
        const storedUsuario = localStorage.getItem("usuario_admin");
        if (storedToken && storedUsuario && storedUsuario !== "undefined" && !isTokenExpired(storedToken)) {
            try {
                setToken(storedToken);
                setUsuario(JSON.parse(storedUsuario));
            } catch (error) {
                console.error("Error al parsear usuario desde localStorage:", error);
                localStorage.removeItem("usuario_admin");
            }
        }
        setLoading(false);
    }, []);

    async function login(correo: string, password: string, app: string) {
        setLoading(true);
        try {
            const res = await api.post("/session/login", { correo, password, app });
            const accessToken = res.data.accessToken;
            const employ = res.data.empleado;
            if (ES_LOCAL) {
                console.log("SesionContext: res.data", JSON.stringify(res.data));
            }
            const usuarioNormalize: AuthUsuario = {
                id_usuario: employ.id_usuario,
                correo: employ.correo,
                nombre: employ.nombre,
                username: employ.username,
                roles: mapRoles(employ.roles)
            }

            setToken(accessToken);
            setUsuario(usuarioNormalize);
            localStorage.setItem('token_admin', accessToken);
            localStorage.setItem('usuario', JSON.stringify(usuarioNormalize))

            return usuarioNormalize;
        } catch (err) {
            if (ES_LOCAL)
                console.log("ERROR SESION CONTEXT: ", err)
            throw err;
        } finally {
            setLoading(false);
        }
    }
    function logout() {
        setUsuario(null);
        setToken(null);
        localStorage.removeItem('token_admin');
        localStorage.removeItem('usuario');
    }
    const value: SessionContextValue = {
        usuario,
        token,
        loading,
        login,
        logout,
    };
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
export function useSessionContext() {
    const ctx = useContext(SessionContext);
    if (!ctx) {
        throw new Error('useSessionContext debe ser usado dentro de un SessionProvider')
    }
    return ctx;
}
function mapRoles(rawRoles: any[]): Rol[] {
    return rawRoles.map((r) => ({
        id_rol: r.id_rol ?? r.id ?? 0,
        nombre: r.nombre ?? "",
        codigo: r.codigo,
        descripcion: r.descripcion ?? "",
        activo: r.activo ?? true,
        en_uso: r.en_uso ?? true,
        por_defecto: r.por_defecto ?? true,
        aplicacion: r.aplicacion,
    }));
}