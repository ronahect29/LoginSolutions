import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { api } from "../services/api";
import { type AuthEmpleado } from "../models/empleado";
import { type Rol } from "../models/rol";
import { ES_LOCAL, isTokenExpired } from "../utils/utils";

interface SessionContextValue {
    empleado: AuthEmpleado | null;
    token: string | null;
    loading: boolean;
    login: (correo: string, password: string, app: string) => Promise<void>;
    logout: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [empleado, setEmpleado] = useState<AuthEmpleado | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const storedToken = localStorage.getItem("token_marcajes");
        const storedEmpleado = localStorage.getItem("empleado");
        if (storedToken && storedEmpleado && storedEmpleado !== "undefined" && !isTokenExpired(storedToken)) {
            try {
                setToken(storedToken);
                setEmpleado(JSON.parse(storedEmpleado));
            } catch (error) {
                console.error("Error al parsear empleado desde localStorage:", error);
                localStorage.removeItem("empleado");
            }
        }
        setLoading(false);
    }, []);

    async function login(correo: string, password: string, app: string) {
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { correo, password, app });
            const accessToken = res.data.accessToken;
            const employ = res.data.empleado;
            if (ES_LOCAL) {
                console.log("SesionContext: res.data", JSON.stringify(res.data));
            }
            const empleadoNormalize: AuthEmpleado = {
                id_usuario: employ.id_usuario,
                id_empleado: employ.id_empleado,
                correo: employ.correo,
                nombre: employ.nombre,
                username: employ.username,
                roles: mapRoles(employ.roles)
            }

            setToken(accessToken);
            setEmpleado(empleadoNormalize);
            localStorage.setItem('token_marcajes', accessToken);
            localStorage.setItem('empleado', JSON.stringify(empleadoNormalize))
        } finally {
            setLoading(false);
        }
    }
    function logout() {
        setEmpleado(null);
        setToken(null);
        localStorage.removeItem('token_marcajes');
        localStorage.removeItem('empleado');
    }
    const value: SessionContextValue = {
        empleado,
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