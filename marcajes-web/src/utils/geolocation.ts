export function getCurrentLocation(): Promise<{
    latitud: number;
    longitud: number;
}> {
    return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
            reject(new Error("El navegador no soporta geolocalización"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                resolve({
                    latitud: lat,
                    longitud: lng
                });
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject(new Error("Permiso de ubicación denegado"));
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject(new Error("Ubicación no disponible"));
                        break;
                    case error.TIMEOUT:
                        reject(new Error("Tiempo de espera agotado"));
                        break;
                    default:
                        reject(new Error("Error desconocido al obtener ubicación"));
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}
