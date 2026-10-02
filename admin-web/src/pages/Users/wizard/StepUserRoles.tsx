import {
    Check,
    LayoutGrid,
    ShieldCheck,
    Star,
} from "lucide-react";

import type {
    FiltroAplicacion,
} from "../../../models/FiltroAplicacion";

import type {
    RolConfigUsuario,
} from "../../../models/FiltroRol";

interface Props {
    appsOptions:
        FiltroAplicacion[];

    rolesOptions:
        RolConfigUsuario[];

    selectedApps:
        FiltroAplicacion[];

    selectedRoles:
        RolConfigUsuario[];

    onAppsChange:
        (
            apps: FiltroAplicacion[]
        ) => void;

    onRolesChange:
        (
            roles: RolConfigUsuario[]
        ) => void;

    onDefaultRoleChange:
        (
            code: string
        ) => void;
}


/* ======================================================
   NOMBRES AMIGABLES
   ====================================================== */

function getApplicationInfo(
    app: FiltroAplicacion
) {
    switch (
        app.codigo
            .trim()
            .toUpperCase()
    ) {
        case "PAW":
            return {
                nombre:
                    "Plataforma Administrativa",

                descripcion:
                    "Administración de usuarios, roles y accesos del sistema.",
            };

        case "PMW":
            return {
                nombre:
                    "Plataforma de Marcajes",

                descripcion:
                    "Registro de marcajes, supervisión y reportería operativa.",
            };

        default:
            return {
                nombre:
                    app.nombre ||
                    app.codigo,

                descripcion:
                    "Aplicación disponible para el usuario.",
            };
    }
}


function getRoleInfo(
    rol: RolConfigUsuario
) {
    switch (
        rol.codigo
            .trim()
            .toUpperCase()
    ) {
        case "SA-PAW":
            return {
                nombre:
                    "Superadministrador",

                descripcion:
                    "Acceso administrativo general a la plataforma.",
            };

        case "COL-PMW":
            return {
                nombre:
                    "Colaborador / Motorista",

                descripcion:
                    "Permite registrar entradas y salidas mediante marcajes.",
            };

        case "SUP-PMW":
            return {
                nombre:
                    "Supervisor",

                descripcion:
                    "Permite supervisar colaboradores, sucursales y reportes.",
            };

        default:
            return {
                nombre:
                    rol.nombre ||
                    rol.codigo,

                descripcion:
                    "Rol disponible para la aplicación seleccionada.",
            };
    }
}


/* ======================================================
   COMPONENTE
   ====================================================== */

export function StepUserRoles({
    appsOptions,
    rolesOptions,
    selectedApps,
    selectedRoles,
    onAppsChange,
    onRolesChange,
    onDefaultRoleChange,
}: Props) {

    /* ======================================================
       APLICACIONES
       ====================================================== */

    function toggleApp(
        app: FiltroAplicacion
    ) {
        const exists =
            selectedApps.some(
                (item) =>
                    item.codigo ===
                    app.codigo
            );

        const next =
            exists
                ? selectedApps.filter(
                      (item) =>
                          item.codigo !==
                          app.codigo
                  )
                : [
                      ...selectedApps,
                      app,
                  ];

        onAppsChange(
            next
        );
    }


    /* ======================================================
       ROLES
       ====================================================== */

    function toggleRol(
        rol: RolConfigUsuario
    ) {
        const exists =
            selectedRoles.some(
                (item) =>
                    item.codigo ===
                    rol.codigo
            );

        let nextRoles:
            RolConfigUsuario[];

        if (
            exists
        ) {
            nextRoles =
                selectedRoles.filter(
                    (item) =>
                        item.codigo !==
                        rol.codigo
                );
        } else {
            nextRoles = [
                ...selectedRoles,
                {
                    ...rol,
                    default:
                        false,
                },
            ];
        }

        if (
            !nextRoles.some(
                (item) =>
                    item.default
            )
        ) {
            nextRoles =
                nextRoles.map(
                    (
                        item,
                        index
                    ) => ({
                        ...item,

                        default:
                            index === 0,
                    })
                );
        }

        onRolesChange(
            nextRoles
        );
    }


    function setDefault(
        rol: RolConfigUsuario
    ) {
        const selected =
            selectedRoles.some(
                (item) =>
                    item.codigo ===
                    rol.codigo
            );

        if (
            !selected
        ) {
            return;
        }

        onDefaultRoleChange(
            rol.codigo
        );
    }


    const rolesDisabled =
        selectedApps.length ===
        0;


    return (
        <div className="uw-step">
            <div className="uw-step-intro">
                <h3>
                    Configuración de acceso
                </h3>

                <p>
                    Define las aplicaciones a las que tendrá acceso
                    el usuario y el nivel de permisos correspondiente.
                </p>
            </div>


            {/* ==================================================
                APLICACIONES
                ================================================== */}

            <div className="uw-access-section">
                <div className="uw-access-heading">
                    <div className="uw-access-heading-icon">
                        <LayoutGrid
                            size={17}
                        />
                    </div>

                    <div>
                        <h4>
                            Aplicaciones
                        </h4>

                        <p>
                            Selecciona las aplicaciones a las que
                            tendrá acceso el usuario.
                        </p>
                    </div>
                </div>


                <div className="uw-choice-grid">
                    {appsOptions.map(
                        (app) => {
                            const selected =
                                selectedApps.some(
                                    (
                                        item
                                    ) =>
                                        item.codigo ===
                                        app.codigo
                                );

                            const info =
                                getApplicationInfo(
                                    app
                                );

                            return (
                                <button
                                    key={
                                        app.codigo
                                    }
                                    type="button"
                                    className={`uw-choice-card ${
                                        selected
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        toggleApp(
                                            app
                                        )
                                    }
                                >
                                    <div className="uw-choice-card-top">
                                        <span className="uw-choice-icon">
                                            <LayoutGrid
                                                size={
                                                    17
                                                }
                                            />
                                        </span>

                                        <span
                                            className={`uw-choice-check ${
                                                selected
                                                    ? "selected"
                                                    : ""
                                            }`}
                                        >
                                            {selected && (
                                                <Check
                                                    size={
                                                        13
                                                    }
                                                />
                                            )}
                                        </span>
                                    </div>


                                    <div className="uw-choice-content">
                                        <strong>
                                            {
                                                info.nombre
                                            }
                                        </strong>

                                        <p>
                                            {
                                                info.descripcion
                                            }
                                        </p>
                                    </div>


                                    <span className="uw-choice-code">
                                        {
                                            app.codigo
                                        }
                                    </span>
                                </button>
                            );
                        }
                    )}
                </div>
            </div>


            {/* ==================================================
                ROLES
                ================================================== */}

            <div className="uw-access-section">
                <div className="uw-access-heading">
                    <div className="uw-access-heading-icon">
                        <ShieldCheck
                            size={17}
                        />
                    </div>

                    <div>
                        <h4>
                            Roles
                        </h4>

                        <p>
                            Selecciona el nivel de acceso que tendrá
                            el usuario en cada aplicación.
                        </p>
                    </div>
                </div>


                {rolesDisabled ? (
                    <div className="uw-roles-empty">
                        <ShieldCheck
                            size={24}
                        />

                        <strong>
                            Selecciona una aplicación
                        </strong>

                        <span>
                            Los roles disponibles aparecerán
                            automáticamente aquí.
                        </span>
                    </div>
                ) : rolesOptions.length ===
                  0 ? (
                    <div className="uw-roles-empty">
                        <ShieldCheck
                            size={24}
                        />

                        <strong>
                            No hay roles disponibles
                        </strong>

                        <span>
                            Las aplicaciones seleccionadas no
                            tienen roles activos disponibles.
                        </span>
                    </div>
                ) : (
                    <div className="uw-role-grid">
                        {rolesOptions.map(
                            (rol) => {
                                const selected =
                                    selectedRoles.some(
                                        (
                                            item
                                        ) =>
                                            item.codigo ===
                                            rol.codigo
                                    );

                                const isDefault =
                                    selectedRoles.some(
                                        (
                                            item
                                        ) =>
                                            item.codigo ===
                                                rol.codigo &&
                                            item.default
                                    );

                                const info =
                                    getRoleInfo(
                                        rol
                                    );

                                return (
                                    <div
                                        key={
                                            rol.codigo
                                        }
                                        className={`uw-role-card ${
                                            selected
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="uw-role-select"
                                            onClick={() =>
                                                toggleRol(
                                                    rol
                                                )
                                            }
                                        >
                                            <div className="uw-choice-card-top">
                                                <span className="uw-choice-icon">
                                                    <ShieldCheck
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </span>

                                                <span
                                                    className={`uw-choice-check ${
                                                        selected
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                >
                                                    {selected && (
                                                        <Check
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    )}
                                                </span>
                                            </div>


                                            <div className="uw-choice-content">
                                                <strong>
                                                    {
                                                        info.nombre
                                                    }
                                                </strong>

                                                <p>
                                                    {
                                                        info.descripcion
                                                    }
                                                </p>
                                            </div>


                                            <span className="uw-choice-code">
                                                {
                                                    rol.codigo
                                                }
                                            </span>
                                        </button>


                                        {selected && (
                                            <button
                                                type="button"
                                                className={`uw-default-role ${
                                                    isDefault
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setDefault(
                                                        rol
                                                    )
                                                }
                                            >
                                                <Star
                                                    size={
                                                        14
                                                    }
                                                    fill={
                                                        isDefault
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />

                                                {isDefault
                                                    ? "Rol principal"
                                                    : "Definir como principal"}
                                            </button>
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>


            {selectedRoles.length >
                1 && (
                <div className="uw-role-help">
                    <Star
                        size={14}
                    />

                    <span>
                        El rol principal será utilizado como
                        acceso predeterminado del usuario.
                    </span>
                </div>
            )}
        </div>
    );
}