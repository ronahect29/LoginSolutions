export function cleanDate(fecha: string): { start: Date; end: Date } {
  const start = new Date(fecha);
  start.setHours(0, 0, 0, 0);

  const end = new Date(fecha);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function getRangoGPSPermitido(): number {
  const rangoEnv = Number(process.env.RANGO_DISTANCIA);
  const rango = Number.isFinite(rangoEnv) ? rangoEnv : 5;
  return rango;
}

export function cleanDateRange(dateStr: string): { start: string; end: string } {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    throw new Error("Formato de fecha inválido. Use yyyy-mm-dd");
  }
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error("Fecha inválida");
  }
  const start = `${dateStr} 00:00:00`;
  const end = `${dateStr} 23:59:59`;

  return { start, end };
}

export const ES_LOCAL = process.env.MODO_LOCAL === 'true';

export function calcularHorasLaboradas(
  horaEntrada: string,
  horaSalida: string
): string {
  if (ES_LOCAL)
    console.log("ENTRA A CALCULAR HORAS")
  const toSeconds = (t: string): number => {
    const [h, m, s] = t.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const segundos =
    toSeconds(horaSalida) - toSeconds(horaEntrada);

  const seguros = Math.max(segundos, 0);

  const hh = Math.floor(seguros / 3600);
  const mm = Math.floor((seguros % 3600) / 60);
  const ss = seguros % 60;

  return `${hh.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}
