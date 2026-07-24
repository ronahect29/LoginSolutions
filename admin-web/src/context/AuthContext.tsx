import { createContext, useContext, useState, type ReactNode, useEffect, } from 'react';
import { api } from '../services/api';

interface AuthUser {
    id: number;
    nombre: string;
    email: string;
    roles: string[];
}

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    login: (correo: string, password: string, app: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    console.log("AuthProvider: ", localStorage)
    useEffect(() => {
        const storedToken = localStorage.getItem('token_admin');
        const storedUser = localStorage.getItem('usuario');

        if (storedToken && storedUser && storedUser !== "undefined") {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error al parsear usuario desde localStorage:", error);
                localStorage.removeItem("usuario");
            }
        }
        setLoading(false);
    }, []);

    async function login(correo: string, password: string, app: string) {
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { correo, password, app });
            const { accessToken, usuario } = res.data;
            console.log("Login response data:", res.data);
            setToken(accessToken);
            setUser(usuario);
            localStorage.setItem('token_admin', accessToken);
            localStorage.setItem('usuario', JSON.stringify(usuario));

        } finally {
            setLoading(false);
        }
    }

    function logout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token_admin');
        localStorage.removeItem('usuario');
    }

    const value: AuthContextValue = {
        user,
        token,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
    }
    return ctx;
}