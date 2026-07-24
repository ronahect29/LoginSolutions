export function calcularDistancia(
    lat1?: number,
    lon1?: number,
    lat2?: number,
    lon2?: number
): number {
    if (
        lat1 == null ||
        lon1 == null ||
        lat2 == null ||
        lon2 == null
    ) return 0;

    const R = 6371000; // metros
    const toRad = (x: number) => (x * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}