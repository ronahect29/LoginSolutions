import { useEffect, useState } from "react";
import {
    type Role,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    type UpsertRoleDto,
} from "../services/roles.service";

export function useRoles() {
    const [items, setItems] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const data = await getRoles();
            setItems(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function create(data: UpsertRoleDto) {
        const created = await createRole(data);
        setItems((prev) => [...prev, created]);
    }

    async function update(id: number, data: UpsertRoleDto) {
        const updated = await updateRole(id, data);
        setItems((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }

    async function remove(id: number) {
        await deleteRole(id);
        setItems((prev) => prev.filter((r) => r.id !== id));
    }

    return { items, loading, create, update, remove, reload: load };
}
