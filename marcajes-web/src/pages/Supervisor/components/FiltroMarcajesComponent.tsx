import { useRef, useState, useEffect } from "react";
import type { FiltrosMarcajes } from "../../../models/marcaje";
import type { FiltroSucursal } from "../../../models/sucursal";
interface Props {
    filters: FiltrosMarcajes;
    sucursales: FiltroSucursal[];
    onChange: (value: FiltrosMarcajes) => void;
    onSearch: () => void;
    onReset: () => void;
}
export function FiltroMarcajesComponent({
    filters,
    sucursales,
    onChange,
    onSearch,
    onReset,
}: Props) {

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function toggleSucursal(id: number) {
        const current = filters.sucursales ?? [];
        const exists = current.includes(id);

        onChange({
            ...filters,
            sucursales: exists
                ? current.filter(x => x !== id)
                : [...current, id],
        });
    }

    // cerrar al hacer click fuera
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="filtros-card">

            <div className="filter-field">
                <label>Desde</label>
                <input
                    type="date"
                    value={filters.fechaDesde ?? ""}
                    onChange={e => onChange({ ...filters, fechaDesde: e.target.value || null })}
                />
            </div>

            <div className="filter-field">
                <label>Hasta</label>
                <input
                    type="date"
                    value={filters.fechaHasta ?? ""}
                    onChange={e => onChange({ ...filters, fechaHasta: e.target.value || null })}
                />
            </div>

            <div className="filter-field dropdown-multiselect" ref={dropdownRef}>
                <label>Sucursales</label>

                <button
                    type="button"
                    className="dropdown-trigger"
                    onClick={() => setOpen(o => !o)}
                >
                    {filters.sucursales?.length
                        ? `${filters.sucursales.length} seleccionadas`
                        : "Seleccionar sucursales"}
                    <span className={`arrow ${open ? "open" : ""}`}>▾</span>
                </button>

                {open && (
                    <div className="dropdown-menu">
                        {sucursales.map(s => (
                            <button
                                key={s.id_sucursal}
                                type="button"
                                className={`pill ${filters.sucursales?.includes(s.id_sucursal) ? "selected" : ""}`}
                                onClick={() => toggleSucursal(s.id_sucursal)}
                            >
                                {s.nombre}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="filter-field">
                <label>Distancia</label>
                <select
                    value={
                        filters.fueraDeRango === null
                            ? "all"
                            : filters.fueraDeRango ? "true" : "false"
                    }
                    onChange={e =>
                        onChange({
                            ...filters,
                            fueraDeRango:
                                e.target.value === "all"
                                    ? null
                                    : e.target.value === "true",
                        })
                    }
                >
                    <option value="all">Todos</option>
                    <option value="true">Fuera de rango</option>
                    <option value="false">En rango</option>
                </select>
            </div>

            {/* botones */}
            <div className="filtros-actions">
                <button className="primary" onClick={onSearch}>Buscar</button>
                <button className="secondary" onClick={onReset}>Limpiar</button>
            </div>

        </div>
    );
}