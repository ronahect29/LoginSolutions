import { useEffect, useState } from "react";

import {
    type UpsertUserDto,
    type User,
    createUser,
    deleteUser,
    getUsers,
    updateUser,
} from "../services/users.service";

export function useUsers() {
    const [items, setItems] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);

        try {
            const data = await getUsers();
            setItems(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, []);

    async function create(data: UpsertUserDto) {
        const created = await createUser(data);

        setItems((prev) => [...prev, created]);
    }

    async function update(id: number, data: UpsertUserDto) {
        const updated = await updateUser(id, data);
        const idNormalizado = String(id);

        setItems((prev) =>
            prev.map((usuario) =>
                usuario.id === idNormalizado ? updated : usuario
            )
        );
    }

    async function remove(id: number) {
        await deleteUser(id);

        const idNormalizado = String(id);

        setItems((prev) =>
            prev.filter((usuario) => usuario.id !== idNormalizado)
        );
    }

    return {
        items,
        loading,
        create,
        update,
        remove,
        reload: load,
    };
}