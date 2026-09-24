import axios from "axios";

const baseURL =
    import.meta.env.VITE_USER_API_URL ||
    "/user-service/api";

export const userApi =
    axios.create({
        baseURL,
    });

// ======================================================
// REQUEST
// ======================================================

userApi.interceptors.request.use(
    (config) => {
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

userApi.interceptors.response.use(
    (response) =>
        response,

    (error) => {
        const status =
            error.response
                ?.status;

        if (
            status === 401 ||
            status === 403
        ) {
            localStorage.removeItem(
                "token_marcajes"
            );

            localStorage.removeItem(
                "empleado"
            );

            if (
                !window.location.pathname.includes(
                    "/marcajes/login"
                )
            ) {
                window.location.href =
                    "/marcajes/login";
            }
        }

        return Promise.reject(
            error
        );
    }
);