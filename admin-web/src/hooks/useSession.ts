import { useSessionContext } from "../context/SesionContext";

export function useSession(){
    return useSessionContext();
}