import {
    useEffect,
    useState,
} from "react";

import {
    changeAppActivo,
    createApp,
    getApps,
    type AppEntity,
    type UpsertAppDto,
    updateApp,
} from "../services/apps.service";

export function useApps() {
    const [
        items,
        setItems,
    ] =
        useState<AppEntity[]>(
            []
        );

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
                await getApps();

            setItems(
                data
            );
        } catch (err) {
            console.error(
                "Error cargando aplicaciones",
                err
            );

            setError(
                "No se pudieron cargar las aplicaciones."
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
        data: UpsertAppDto
    ) {
        const created =
            await createApp(
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
        data: UpsertAppDto
    ) {
        const updated =
            await updateApp(
                id,
                data
            );

        setItems((prev) =>
            prev
                .map(
                    (app) =>
                        app.id_aplicacion ===
                        id
                            ? updated
                            : app
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
            await changeAppActivo(
                id,
                activo
            );

        setItems((prev) =>
            prev.map(
                (app) =>
                    app.id_aplicacion ===
                    id
                        ? updated
                        : app
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