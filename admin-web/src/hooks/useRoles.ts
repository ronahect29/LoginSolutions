import {
    useEffect,
    useState,
} from "react";

import {
    changeRoleActivo,
    createRole,
    getRoles,
    type Role,
    type UpsertRoleDto,
    updateRole,
} from "../services/roles.service";

export function useRoles() {
    const [
        items,
        setItems,
    ] =
        useState<Role[]>([]);

    const [
        loading,
        setLoading,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState<
            string | null
        >(null);

    // ======================================================
    // CARGA
    // ======================================================

    async function load() {
        setLoading(true);
        setError(null);

        try {
            const data =
                await getRoles();

            setItems(
                data
            );
        } catch (err) {
            console.error(
                "Error cargando roles",
                err
            );

            setError(
                "No se pudieron cargar los roles."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, []);

    // ======================================================
    // CREACIÓN
    // ======================================================

    async function create(
        data: UpsertRoleDto
    ) {
        const created =
            await createRole(
                data
            );

        setItems((prev) =>
            [
                ...prev,
                created,
            ].sort(
                (a, b) =>
                    a.nombre.localeCompare(
                        b.nombre,
                        "es"
                    )
            )
        );

        return created;
    }

    // ======================================================
    // ACTUALIZACIÓN
    // ======================================================

    async function update(
        id: number,
        data: UpsertRoleDto
    ) {
        const updated =
            await updateRole(
                id,
                data
            );

        setItems((prev) =>
            prev
                .map(
                    (role) =>
                        role.id_rol ===
                        id
                            ? updated
                            : role
                )
                .sort(
                    (a, b) =>
                        a.nombre.localeCompare(
                            b.nombre,
                            "es"
                        )
                )
        );

        return updated;
    }

    // ======================================================
    // ESTADO
    // ======================================================

    async function changeActivo(
        id: number,
        activo: boolean
    ) {
        const updated =
            await changeRoleActivo(
                id,
                activo
            );

        setItems((prev) =>
            prev.map(
                (role) =>
                    role.id_rol ===
                    id
                        ? updated
                        : role
            )
        );

        return updated;
    }

    return {
        items,
        loading,
        error,
        create,
        update,
        changeActivo,
        reload: load,
    };
}