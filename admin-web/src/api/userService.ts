import axios from "axios";

const userService = axios.create({
    baseURL: import.meta.env.VITE_USER_SERVICE_URL,
});

userService.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token_admin");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export default userService;