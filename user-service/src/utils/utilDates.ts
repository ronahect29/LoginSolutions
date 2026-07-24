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

export function cleanDate(
    input: string | Date,
    inicio: boolean
): Date {

    let date: Date;


    if (input instanceof Date) {
        if (isNaN(input.getTime())) {
            throw new Error("Fecha inválida");
        }
        date = new Date(input);
    } else {
        const regex =
            /^(\d{4})-(\d{2})-(\d{2})(?:\s(\d{2})(?::(\d{2}))?(?::(\d{2}))?)?$/;

        const match = input.match(regex);
        if (!match) {
            throw new Error(
                "Formato de fecha inválido. Use yyyy-mm-dd [hh[:mm[:ss]]]"
            );
        }

        const [
            ,
            year,
            month,
            day,
            hour = "0",
            minute = "0",
            second = "0",
        ] = match;

        date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute),
            Number(second),
            0
        );
        if (
            date.getFullYear() !== Number(year) ||
            date.getMonth() !== Number(month) - 1 ||
            date.getDate() !== Number(day)
        ) {
            throw new Error("Fecha inválida");
        }
    }
    if (inicio) {
        date.setHours(0, 0, 0, 0);
    } else {
        date.setHours(23, 59, 59, 999);
    }

    return date;
}

export function formatDateTime(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Fecha inválida");
    }

    const pad = (n: number) => String(n).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}