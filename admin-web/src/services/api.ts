import axios from "axios";


const baseURL =
    import.meta.env.VITE_USER_SERVICE_URL ||
    "https://login.solutions.local/user-service/api";


// ======================================================
// CLIENTE PÚBLICO
//
// Se utiliza para login.
// NO tiene interceptores de sesión.
// ======================================================

export const publicApi =
    axios.create({
        baseURL
    });


// ======================================================
// CLIENTE PROTEGIDO
//
// Se utiliza después de iniciar sesión.
// ======================================================

export const api =
    axios.create({
        baseURL
    });


// ======================================================
// REQUEST
// ======================================================

api.interceptors.request.use(
    (
        config
    ) => {
        const token =
            localStorage.getItem(
                "token_admin"
            );


        if (
            token &&
            config.headers
        ) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }


        return config;
    }
);


// ======================================================
// RESPONSE
// ======================================================

api.interceptors.response.use(
    (
        response
    ) =>
        response,

    (
        error
    ) => {
        const status =
            error?.response
                ?.status;


        /*
         * Este cliente solamente se utiliza una vez
         * autenticado el usuario.
         *
         * Por lo tanto, un 401 indica que la sesión
         * dejó de ser válida.
         */
        if (
            status ===
            401
        ) {
            localStorage.removeItem(
                "token_admin"
            );

            localStorage.removeItem(
                "usuario_admin"
            );

            localStorage.removeItem(
                "usuario"
            );


            window.dispatchEvent(
                new Event(
                    "session-expired"
                )
            );
        }


        return Promise.reject(
            error
        );
    }
);