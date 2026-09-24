import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import type { Rol } from "../models/rol";
import type { AuthUsuario } from "../models/usuario";
import { api } from "../services/api";
import {
    ES_LOCAL,
    isTokenExpired,
} from "../utils/utils";

interface SessionContextValue {
    usuario: AuthUsuario | null;
    token: string | null;
    loading: boolean;

    login: (
        correo: string,
        password: string,
        app: string
    ) => Promise<AuthUsuario>;

    logout: () => void;
}

const SessionContext =
    createContext<
        SessionContextValue | undefined
    >(undefined);

const TOKEN_KEY = "token_admin";
const USUARIO_KEY = "usuario_admin";
const LEGACY_USUARIO_KEY = "usuario";

export function SessionProvider({
    children,
}: {
    children: ReactNode;
}) {
    const navigate = useNavigate();

    const [usuario, setUsuario] =
        useState<AuthUsuario | null>(null);

    const [token, setToken] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    function limpiarSesionLocal() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USUARIO_KEY);
        localStorage.removeItem(
            LEGACY_USUARIO_KEY
        );
    }

    function logout() {
        setUsuario(null);
        setToken(null);

        limpiarSesionLocal();
    }

    useEffect(() => {
        function onSessionExpired() {
            logout();

            navigate(
                "/admin/login",
                {
                    replace: true,
                }
            );
        }

        window.addEventListener(
            "session-expired",
            onSessionExpired
        );

        return () => {
            window.removeEventListener(
                "session-expired",
                onSessionExpired
            );
        };
    }, [navigate]);

    useEffect(() => {
        const storedToken =
            localStorage.getItem(
                TOKEN_KEY
            );

        const storedUsuario =
            localStorage.getItem(
                USUARIO_KEY
            ) ??
            localStorage.getItem(
                LEGACY_USUARIO_KEY
            );

        if (
            storedToken &&
            storedUsuario &&
            storedUsuario !== "undefined" &&
            !isTokenExpired(storedToken)
        ) {
            try {
                const usuarioGuardado =
                    JSON.parse(
                        storedUsuario
                    ) as AuthUsuario;

                setToken(storedToken);

                setUsuario(
                    usuarioGuardado
                );

                localStorage.setItem(
                    USUARIO_KEY,
                    JSON.stringify(
                        usuarioGuardado
                    )
                );

                localStorage.removeItem(
                    LEGACY_USUARIO_KEY
                );
            } catch (error) {
                console.error(
                    "Error al restaurar la sesión:",
                    error
                );

                limpiarSesionLocal();
            }
        } else if (
            storedToken ||
            storedUsuario
        ) {
            limpiarSesionLocal();
        }

        setLoading(false);
    }, []);

    async function login(
        correo: string,
        password: string,
        app: string
    ) {
        setLoading(true);

        try {
            const res =
                await api.post(
                    "/session/login",
                    {
                        correo,
                        password,
                        app,
                    }
                );

            const accessToken =
                res.data.accessToken;

            const employ =
                res.data.empleado;

            if (ES_LOCAL) {
                console.log(
                    "SesionContext: res.data",
                    JSON.stringify(
                        res.data
                    )
                );
            }

            const usuarioNormalize:
                AuthUsuario = {
                id_usuario:
                    employ.id_usuario,

                correo:
                    employ.correo,

                nombre:
                    employ.nombre,

                username:
                    employ.username,

                roles:
                    mapRoles(
                        employ.roles
                    ),
            };

            setToken(accessToken);

            setUsuario(
                usuarioNormalize
            );

            localStorage.setItem(
                TOKEN_KEY,
                accessToken
            );

            localStorage.setItem(
                USUARIO_KEY,
                JSON.stringify(
                    usuarioNormalize
                )
            );

            localStorage.removeItem(
                LEGACY_USUARIO_KEY
            );

            return usuarioNormalize;
        } catch (error) {
            if (ES_LOCAL) {
                console.log(
                    "ERROR SESION CONTEXT:",
                    error
                );
            }

            throw error;
        } finally {
            setLoading(false);
        }
    }

    const value:
        SessionContextValue = {
        usuario,
        token,
        loading,
        login,
        logout,
    };

    return (
        <SessionContext.Provider
            value={value}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext() {
    const ctx =
        useContext(SessionContext);

    if (!ctx) {
        throw new Error(
            "useSessionContext debe ser usado dentro de un SessionProvider"
        );
    }

    return ctx;
}

function mapRoles(
    rawRoles: any[]
): Rol[] {
    return rawRoles.map((r) => ({
        id_rol:
            r.id_rol ??
            r.id ??
            0,

        nombre:
            r.nombre ??
            "",

        codigo:
            r.codigo,

        descripcion:
            r.descripcion ??
            "",

        activo:
            r.activo ??
            true,

        en_uso:
            r.en_uso ??
            true,

        por_defecto:
            r.por_defecto ??
            true,

        aplicacion:
            r.aplicacion,
    }));
}