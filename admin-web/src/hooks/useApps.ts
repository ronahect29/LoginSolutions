import { useEffect, useState } from "react";
import {
    type AppEntity,
    getApps,
    createApp,
    updateApp,
    deleteApp,
    type UpsertAppDto,
} from "../services/apps.service";

export function useApps() {
    const [items, setItems] = useState<AppEntity[]>([]);
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const data = await getApps();
            setItems(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function create(data: UpsertAppDto) {
        const created = await createApp(data);
        setItems((prev) => [...prev, created]);
    }

    async function update(id: number, data: UpsertAppDto) {
        const updated = await updateApp(id, data);
        setItems((prev) => prev.map((a) => (a.id === id ? updated : a)));
    }

    async function remove(id: number) {
        await deleteApp(id);
        setItems((prev) => prev.filter((a) => a.id !== id));
    }

    return { items, loading, create, update, remove, reload: load };
}
