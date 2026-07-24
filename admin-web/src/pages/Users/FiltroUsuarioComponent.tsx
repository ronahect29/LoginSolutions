import { useMemo, useState } from "react";
import "../../styles/FiltroUsuario.css";
import type { FiltroUsuario } from "../../models/FiltrosUsuario";
import type { FiltroAplicacion } from "../../models/FiltroAplicacion";
import type { FiltroRol } from "../../models/FiltroRol";


interface UserFiltersProps {
    appsOptions: FiltroAplicacion[];
    rolesOptions: FiltroRol[];
    onAppsSelectedChange?: (apps: FiltroAplicacion[]) => void;
    onSearch: (filters: FiltroUsuario) => void;
    onReset?: () => void;
}


const initialFilters: FiltroUsuario = {
    nombre: "",
    usuario: "",
    activo: null,

    creadoDesde: "",
    creadoHasta: "",
    modDesde: "",
    modHasta: "",

    aplicaciones: [],
    roles: [],
};

export function FiltroUsuarioComponent({
    appsOptions,
    rolesOptions,
    onAppsSelectedChange,
    onSearch,
    onReset,
}: UserFiltersProps) {
    const [filters, setFilters] = useState<FiltroUsuario>(initialFilters);

    const rolesDisabled = useMemo(() => filters.aplicaciones.length === 0, [filters.aplicaciones]);

    function update(partial: Partial<FiltroUsuario>) {
        const next = { ...filters, ...partial };

        if (partial.aplicaciones && partial.aplicaciones.length === 0) {
            next.roles = [];
        }

        setFilters(next);
    }

    function toggleAplicacion(app: FiltroAplicacion) {
        const exists = filters.aplicaciones.some(a => a.codigo === app.codigo);
        const nuevasApps = exists
            ? filters.aplicaciones.filter((a) => a.codigo !== app.codigo)
            : [...filters.aplicaciones, app];
        const next: FiltroUsuario = {
            ...filters, aplicaciones: nuevasApps, roles: []
        };
        setFilters(next);
        onAppsSelectedChange?.(nuevasApps);
    }
    function toggleRol(rol: FiltroRol) {
        if (rolesDisabled) return;
        const exists = filters.roles.some(r => r.codigo === rol.codigo);
        update({
            roles: exists
                ? filters.roles.filter(r => r.id_rol !== rol.id_rol)
                : [...filters.roles, rol]
        });
    }
    function handleSearch() {
        onSearch(filters);
    }
    function handleReset() {
        setFilters(initialFilters);
        onAppsSelectedChange?.([]);
        onReset?.();
    }

    return (
        <div className="user-filters-card">
            <div className="user-filters-header">
                <h2 className="user-filters-title">Filtros</h2>
                <button className="user-filters-reset" type="button" onClick={handleReset}>
                    Limpiar
                </button>
                <button className="user-filters-search" type="button" onClick={handleSearch}>Buscar</button>
            </div>

            {/* Bloque: texto + estado */}
            <div className="user-filters-grid">
                <div className="uf-field">
                    <label>Nombre</label>
                    <input
                        value={filters.nombre}
                        onChange={(e) => update({ nombre: e.target.value })}
                        placeholder="Ej: Nombre Apellido"
                    />
                </div>

                <div className="uf-field">
                    <label>Usuario (correo)</label>
                    <input
                        value={filters.usuario}
                        onChange={(e) => update({ usuario: e.target.value })}
                        placeholder="Ej: ejemplo@correo.com"
                    />
                </div>

                <div className="uf-field">
                    <label>Activo</label>
                    <select
                        value={filters.activo === null ? "all" : filters.activo ? "true" : "false"}
                        onChange={(e) => update({ activo: e.target.value === "all" ? null : e.target.value === "true" })}>
                        <option value="all">Todos</option>
                        <option value="true">Activos</option>
                        <option value="false">Inactivos</option>
                    </select>
                </div>
            </div>

            {/* Bloque: fechas */}
            <div className="user-filters-section">
                <h3 className="user-filters-subtitle">Fechas</h3>

                <div className="user-filters-dates">
                    <div className="uf-date-group">
                        <div className="uf-date-title">Creación</div>
                        <div className="uf-date-row">
                            <div className="uf-field">
                                <label>Desde</label>
                                <input
                                    type="date"
                                    value={filters.creadoDesde}
                                    onChange={(e) => update({ creadoDesde: e.target.value })}
                                />
                            </div>
                            <div className="uf-field">
                                <label>Hasta</label>
                                <input
                                    type="date"
                                    value={filters.creadoHasta}
                                    onChange={(e) => update({ creadoHasta: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="uf-date-group">
                        <div className="uf-date-title">Modificación</div>
                        <div className="uf-date-row">
                            <div className="uf-field">
                                <label>Desde</label>
                                <input
                                    type="date"
                                    value={filters.modDesde}
                                    onChange={(e) => update({ modDesde: e.target.value })}
                                />
                            </div>
                            <div className="uf-field">
                                <label>Hasta</label>
                                <input
                                    type="date"
                                    value={filters.modHasta}
                                    onChange={(e) => update({ modHasta: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           {/* Bloque: multi-selects */}
            <div className="user-filters-section">
                <h3 className="user-filters-subtitle">Asignaciones</h3>

                <div className="user-filters-grid">
                    <div className="uf-field">
                        <label>Aplicaciones (multi)</label>
                        <div className="uf-multiselect">
                            {appsOptions?.map(app => {
                                const selected = filters.aplicaciones.some(a => a.codigo === app.codigo);
                                return (<button
                                    key={app.codigo} type="button" className={selected ? "uf-pill selected" : "uf-pill"}
                                    onClick={() => toggleAplicacion(app)} title={app.nombre}>
                                    {app.codigo}
                                </button>)
                             })
                            }
                        </div>
                        <div className="uf-hint">Selecciona una o varias aplicaciones</div>
                    </div>

                    <div className="uf-field">
                        <label>Roles (multi) (depende de aplicación)</label>
                        <div className={`uf-multiselect ${rolesDisabled ? "disabled" : ""}`}>
                            {
                                rolesOptions?.map(rol => {
                                    const selected = filters.roles.some(r => r.codigo === rol.codigo);
                                    return (<button
                                        key={rol.codigo} type="button" className={selected ? "uf-pill selected" : "uf-pill"}
                                        onClick={() => toggleRol(rol)} title={rol.nombre}>{rol.codigo}</button>);
                                })
                            }
                        </div>
                        {rolesDisabled ? (
                            <div className="uf-hint warn">Primero selecciona al menos una aplicación</div>
                        ) : (
                            <div className="uf-hint">Selecciona uno o varios roles</div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
