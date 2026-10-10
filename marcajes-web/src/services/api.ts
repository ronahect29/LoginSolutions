import axios from "axios";


const baseURL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4100/marcajes-api/api";


// ======================================================
// CLIENTE PÚBLICO
//
// Exclusivo para login.
// ======================================================

export const publicApi =
    axios.create({
        baseURL
    });


// ======================================================
// CLIENTE PROTEGIDO
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
                "token_marcajes"
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
         * Este cliente se utiliza únicamente
         * para operaciones con sesión iniciada.
         */
        if (
            status ===
                401 ||
            status ===
                403
        ) {
            localStorage.removeItem(
                "token_marcajes"
            );


            localStorage.removeItem(
                "empleado"
            );


            window.location.href =
                "/marcajes/login";
        }


        return Promise.reject(
            error
        );
    }
);