import axios from "axios";
import { UserServiceLoginResponse } from "../models/user";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://user-service:4000/user-service/api/session/";

// export async function proxyLogin(correo: string, password: string, app: string) {
//     try {
//         const response = await axios.post(`${AUTH_SERVICE_URL}login`, { correo, password, app },
//             {validateStatus: () => true}
//         );
//         console.log("proxyLogin response: " + JSON.stringify(response.data) )
//         return { ok: true, data: response.data };
//     } catch (error: any) {
//         console.error("Error en authProxyService proxyLogin:", error.response?.data || error);
//         return { ok: false, error: error.response?.data || { message: "Error en el servicio de autenticación" } };
//     }
// }

export async function proxyLogin(
  correo: string,
  password: string,
  app: string
): Promise<{ ok: true; data: UserServiceLoginResponse } | { ok: false; error: any }> {
  try {
    const response = await axios.post<UserServiceLoginResponse>(
      `${AUTH_SERVICE_URL}login`,
      { correo, password, app }
    );
    return { ok: true, data: response.data };
  } catch (error: any) {
    return { ok: false, error: error.response?.data };
  }
}