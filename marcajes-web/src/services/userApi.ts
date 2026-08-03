import axios from "axios";

const baseURL =
    import.meta.env.VITE_USER_API_URL ||
    "/user-service/api";

export const userApi = axios.create({
    baseURL
});

userApi.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("token_marcajes");

    if (token && config.headers) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

userApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(
                "token_marcajes"
            );

            localStorage.removeItem(
                "empleado"
            );

            if (
                !window.location.pathname.includes(
                    "login"
                )
            ) {
                window.location.href =
                    "/marcajes/login";
            }
        }

        return Promise.reject(error);
    }
);