import {
    useEffect,
    useRef,
    useState
} from "react";

import type {
    FiltrosMarcajes
} from "../../../models/marcaje";

import type {
    FiltroSucursal
} from "../../../models/sucursal";


interface Props {
    filters: FiltrosMarcajes;

    sucursales:
        FiltroSucursal[];

    loading:
        boolean;

    onChange:
        (
            value:
                FiltrosMarcajes
        ) => void;

    onSearch:
        () => void;

    onReset:
        () => void;
}


// ======================================================
// ICONOS
// ======================================================

function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <circle
                cx="11"
                cy="11"
                r="7"
            />

            <path
                d="m20 20-4-4"
            />
        </svg>
    );
}


function ResetIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <path
                d="M3 12a9 9 0 1 0 3-6.7"
            />

            <path
                d="M3 4v6h6"
            />
        </svg>
    );
}


// ======================================================
// COMPONENTE
// ======================================================

export function FiltroMarcajesComponent({
    filters,
    sucursales,
    loading,
    onChange,
    onSearch,
    onReset
}: Props) {
    const [
        open,
        setOpen
    ] = useState(false);

    const dropdownRef =
        useRef<HTMLDivElement>(
            null
        );


    // ======================================================
    // SUCURSALES
    // ======================================================

    function toggleSucursal(
        id: number
    ) {
        const current =
            filters.sucursales ??
            [];

        const exists =
            current.includes(
                id
            );

        const next =
            exists
                ? current.filter(
                    (value) =>
                        value !== id
                )
                : [
                    ...current,
                    id
                ];

        onChange({
            ...filters,

            sucursales:
                next.length > 0
                    ? next
                    : null
        });
    }


    function limpiarSucursales() {
        onChange({
            ...filters,
            sucursales: null
        });
    }


    // ======================================================
    // CERRAR DROPDOWN
    // ======================================================

    useEffect(() => {
        function handleClickOutside(
            event: MouseEvent
        ) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);


    // ======================================================
    // TEXTO SUCURSALES
    // ======================================================

    const cantidadSucursales =
        filters.sucursales
            ?.length ?? 0;


    return (
        <div className="repo-filtros">

            {/* ======================================================
                DESDE
                ====================================================== */}

            <div className="repo-filtro-campo">
                <label htmlFor="repo-fecha-desde">
                    Desde
                </label>

                <input
                    id="repo-fecha-desde"
                    type="date"
                    value={
                        filters.fechaDesde ??
                        ""
                    }
                    onChange={(
                        event
                    ) =>
                        onChange({
                            ...filters,

                            fechaDesde:
                                event
                                    .target
                                    .value ||
                                null
                        })
                    }
                />
            </div>


            {/* ======================================================
                HASTA
                ====================================================== */}

            <div className="repo-filtro-campo">
                <label htmlFor="repo-fecha-hasta">
                    Hasta
                </label>

                <input
                    id="repo-fecha-hasta"
                    type="date"
                    value={
                        filters.fechaHasta ??
                        ""
                    }
                    onChange={(
                        event
                    ) =>
                        onChange({
                            ...filters,

                            fechaHasta:
                                event
                                    .target
                                    .value ||
                                null
                        })
                    }
                />
            </div>


            {/* ======================================================
                SUCURSALES
                ====================================================== */}

            <div
                className="repo-filtro-campo repo-multiselect"
                ref={
                    dropdownRef
                }
            >
                <label>
                    Sucursales
                </label>

                <button
                    type="button"
                    className={`repo-multiselect__trigger ${
                        open
                            ? "repo-multiselect__trigger--open"
                            : ""
                    }`}
                    onClick={() =>
                        setOpen(
                            (
                                value
                            ) =>
                                !value
                        )
                    }
                >
                    <span>
                        {cantidadSucursales >
                        0
                            ? `${cantidadSucursales} ${
                                cantidadSucursales ===
                                1
                                    ? "sucursal"
                                    : "sucursales"
                            }`
                            : "Todas las sucursales"}
                    </span>

                    <span className="repo-multiselect__flecha">
                        ▾
                    </span>
                </button>

                {open && (
                    <div className="repo-multiselect__menu">
                        <div className="repo-multiselect__encabezado">
                            <span>
                                Seleccionar
                                sucursales
                            </span>

                            {cantidadSucursales >
                                0 && (
                                <button
                                    type="button"
                                    onClick={
                                        limpiarSucursales
                                    }
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>

                        <div className="repo-multiselect__lista">
                            {sucursales.map(
                                (
                                    sucursal
                                ) => {
                                    const seleccionada =
                                        filters
                                            .sucursales
                                            ?.includes(
                                                sucursal.id_sucursal
                                            ) ??
                                        false;

                                    return (
                                        <button
                                            key={
                                                sucursal.id_sucursal
                                            }
                                            type="button"
                                            className={`repo-multiselect__opcion ${
                                                seleccionada
                                                    ? "repo-multiselect__opcion--seleccionada"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                toggleSucursal(
                                                    sucursal.id_sucursal
                                                )
                                            }
                                        >
                                            <span className="repo-multiselect__check">
                                                {seleccionada
                                                    ? "✓"
                                                    : ""}
                                            </span>

                                            <span>
                                                {
                                                    sucursal.nombre
                                                }
                                            </span>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>
                )}
            </div>


            {/* ======================================================
                DISTANCIA
                ====================================================== */}

            <div className="repo-filtro-campo">
                <label htmlFor="repo-distancia">
                    Ubicación
                </label>

                <select
                    id="repo-distancia"
                    value={
                        filters.fueraDeRango ===
                        null
                            ? "all"
                            : filters.fueraDeRango
                                ? "true"
                                : "false"
                    }
                    onChange={(
                        event
                    ) =>
                        onChange({
                            ...filters,

                            fueraDeRango:
                                event
                                    .target
                                    .value ===
                                "all"
                                    ? null
                                    : event
                                        .target
                                        .value ===
                                    "true"
                        })
                    }
                >
                    <option value="all">
                        Todas las ubicaciones
                    </option>

                    <option value="false">
                        En rango
                    </option>

                    <option value="true">
                        Fuera de rango
                    </option>
                </select>
            </div>


            {/* ======================================================
                ACCIONES
                ====================================================== */}

            <div className="repo-filtros__acciones">
                <button
                    type="button"
                    className="repo-filtros__limpiar"
                    onClick={
                        onReset
                    }
                    disabled={
                        loading
                    }
                >
                    <ResetIcon />

                    Limpiar
                </button>

                <button
                    type="button"
                    className="repo-filtros__buscar"
                    onClick={
                        onSearch
                    }
                    disabled={
                        loading
                    }
                >
                    <SearchIcon />

                    {loading
                        ? "Buscando..."
                        : "Buscar"}
                </button>
            </div>
        </div>
    );
}