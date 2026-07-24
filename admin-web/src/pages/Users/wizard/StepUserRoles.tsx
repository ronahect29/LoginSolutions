import type { FiltroAplicacion } from "../../../models/FiltroAplicacion";
import type { RolConfigUsuario } from "../../../models/FiltroRol";

interface Props {
    appsOptions: FiltroAplicacion[];
    rolesOptions: RolConfigUsuario[];

    selectedApps: FiltroAplicacion[];
    selectedRoles: RolConfigUsuario[];

    onAppsChange: (apps: FiltroAplicacion[]) => void;
    onRolesChange: (roles: RolConfigUsuario[]) => void;
    onDefaultRoleChange: (code: string) => void;
}

export function StepUserRoles({
    appsOptions,
    rolesOptions,
    selectedApps,
    selectedRoles,
    onAppsChange,
    onRolesChange,
    onDefaultRoleChange
}: Props) {

    /* ===== APPS (SOLO FILTRO) ===== */
    function toggleApp(app: FiltroAplicacion) {
        const exists = selectedApps.some(a => a.codigo === app.codigo);
        const next = exists
            ? selectedApps.filter(a => a.codigo !== app.codigo)
            : [...selectedApps, app];

        onAppsChange(next);
    }

    /* ===== ROLES ===== */
    function toggleRol(rol: RolConfigUsuario) {
        const exists = selectedRoles.some(r => r.codigo === rol.codigo);

        let nextRoles: RolConfigUsuario[];

        if (exists) {
            nextRoles = selectedRoles.filter(r => r.codigo !== rol.codigo);
        } else {
            nextRoles = [...selectedRoles, { ...rol, default: false }];
        }

        // si se eliminó el rol default, limpiarlo
        if (!nextRoles.some(r => r.default)) {
            nextRoles = nextRoles.map(r => ({ ...r, default: false }));
        }

        onRolesChange(nextRoles);
    }

    function setDefault(rol: RolConfigUsuario) {
        if (!selectedRoles.some(r => r.codigo === rol.codigo)) return;
        onDefaultRoleChange(rol.codigo);
    }

    const rolesDisabled = selectedApps.length === 0;

    return (
        <div className="uw-step">
            <h3>Configuración de Rol</h3>

            {/* ===== APPS ===== */}
            <div className="uf-field">
                <label>Aplicaciones</label>
                <div className="uf-multiselect">
                    {appsOptions.map(app => {
                        const selected = selectedApps.some(a => a.codigo === app.codigo);
                        return (
                            <button
                                key={app.codigo}
                                type="button"
                                className={`uf-pill ${selected ? "selected" : ""}`}
                                onClick={() => toggleApp(app)}
                            >
                                {app.codigo}
                            </button>
                        );
                    })}
                </div>
                <div className="uf-hint">
                    Selecciona aplicaciones para filtrar roles
                </div>
            </div>

            {/* ===== ROLES ===== */}
            <div className="uf-field">
                <label>Roles</label>

                <div className={`uf-multiselect ${rolesDisabled ? "disabled" : ""}`}>
                    {rolesOptions.map(rol => {
                        const selected = selectedRoles.some(r => r.codigo === rol.codigo);
                        const isDefault = selectedRoles.some(
                            r => r.codigo === rol.codigo && r.default
                        );

                        return (
                            <button
                                key={rol.codigo}
                                type="button"
                                disabled={rolesDisabled}
                                className={`uf-pill ${selected ? "selected" : ""}`}
                                onClick={() => toggleRol(rol)}
                            >
                                {rol.codigo}

                                {selected && (
                                    <span
                                        className={`uf-star ${isDefault ? "filled" : ""}`}
                                        title={
                                            isDefault
                                                ? "Rol por defecto"
                                                : "Marcar como rol por defecto"
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDefault(rol);
                                        }}
                                    >
                                        {isDefault ? "★" : "☆"}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {rolesDisabled ? (
                    <div className="uf-hint warn">
                        Primero selecciona al menos una aplicación
                    </div>
                ) : (
                    <div className="uf-hint">
                        Selecciona uno o más roles y marca uno como principal
                    </div>
                )}
            </div>
        </div>
    );
}
