import { api } from "./api";

export async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.token;
    localStorage.setItem("token_admin", token);
    localStorage.setItem("roles_admin", JSON.stringify(res.data.roles));
    localStorage.setItem("apps_admin", JSON.stringify(res.data.apps));
    return res.data;
}