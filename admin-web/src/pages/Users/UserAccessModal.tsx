import {
    Save,
    ShieldCheck,
    X
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import axios from "axios";

import type {
    FiltroAplicacion
} from "../../models/FiltroAplicacion";

import type {
    FiltroRol,
    RolConfigUsuario
} from "../../models/FiltroRol";

import type {
    Usuario
} from "../../models/usuario";

import {
    api
} from "../../services/api";

import {
    StepUserRoles
} from "./wizard/StepUserRoles";

import "./styles/user-actions.css";
import "./styles/user-wizard.css";
import "./styles/user-access.css";


interface Props {
    user:
        Usuario;

    appsOptions:
        FiltroAplicacion[];

    onClose:
        () => void;

    onSaved:
        () => void;
}


interface AccessResponse {
    usuario: {
        id_usuario: number;
        nombre: string;
        correo: string;
        username: string;
        activo: boolean;
    };

    aplicaciones:
        FiltroAplicacion[];

    roles:
        RolConfigUsuario[];

    tiene_acceso_pmw:
        boolean;
}


function obtenerMensajeError(
    error:
        unknown
): string {
    if (
        axios.isAxiosError<{
            message?: string;
        }>(
            error
        )
    ) {
        return (
            error.response
                ?.data
                ?.message ||
            "No fue posible completar la operación."
        );
    }


    if (
        error instanceof
        Error
    ) {
        return error.message;
    }


    return "Ocurrió un error inesperado.";
}


export function UserAccessModal({
    user,
    appsOptions,
    onClose,
    onSaved
}: Props) {
    const [
        selectedApps,
        setSelectedApps
    ] =
        useState<
            FiltroAplicacion[]
        >([]);


    const [
        rolesOptions,
        setRolesOptions
    ] =
        useState<
            RolConfigUsuario[]
        >([]);


    const [
        selectedRoles,
        setSelectedRoles
    ] =
        useState<
            RolConfigUsuario[]
        >([]);


    const [
        cargando,
        setCargando
    ] =
        useState(
            true
        );


    const [
        cargandoRoles,
        setCargandoRoles
    ] =
        useState(
            false
        );


    const [
        guardando,
        setGuardando
    ] =
        useState(
            false
        );


    const [
        error,
        setError
    ] =
        useState<
            string |
            null
        >(
            null
        );


    async function cargarRoles(
        aplicaciones:
            FiltroAplicacion[],

        rolesAConservar:
            RolConfigUsuario[]
    ) {
        if (
            aplicaciones.length ===
            0
        ) {
            setRolesOptions(
                []
            );

            setSelectedRoles(
                []
            );

            return;
        }


        setCargandoRoles(
            true
        );


        try {
            const respuesta =
                await api.post<
                    FiltroRol[]
                >(
                    "/rol/findByActivoAndCodigosAplicacionActivo",
                    {
                        activo:
                            true,

                        appsCodes:
                            aplicaciones.map(
                                (
                                    aplicacion
                                ) =>
                                    aplicacion.codigo
                            )
                    }
                );


            const opciones:
                RolConfigUsuario[] =
                respuesta.data
                    .map(
                        (
                            rol
                        ) => ({
                            id_rol:
                                rol.id_rol,

                            nombre:
                                rol.nombre,

                            codigo:
                                rol.codigo,

                            id_aplicacion:
                                rol.id_aplicacion,

                            aplicacion_codigo:
                                rol.aplicacion_codigo,

                            default:
                                false
                        })
                    );


            setRolesOptions(
                opciones
            );


            let seleccion =
                rolesAConservar
                    .filter(
                        (
                            rolSeleccionado
                        ) =>
                            opciones.some(
                                (
                                    opcion
                                ) =>
                                    opcion.id_rol ===
                                    rolSeleccionado.id_rol
                            )
                    );


            if (
                seleccion.length >
                    0 &&
                !seleccion.some(
                    (
                        rol
                    ) =>
                        rol.default
                )
            ) {
                seleccion =
                    seleccion.map(
                        (
                            rol,
                            index
                        ) => ({
                            ...rol,

                            default:
                                index ===
                                0
                        })
                    );
            }


            setSelectedRoles(
                seleccion
            );
        } catch (
            errorPeticion
        ) {
            console.error(
                "Error cargando roles:",
                errorPeticion
            );


            setRolesOptions(
                []
            );


            setError(
                obtenerMensajeError(
                    errorPeticion
                )
            );
        } finally {
            setCargandoRoles(
                false
            );
        }
    }


    useEffect(
        () => {
            let activo =
                true;


            async function cargar() {
                setCargando(
                    true
                );

                setError(
                    null
                );


                try {
                    const respuesta =
                        await api.get<
                            AccessResponse
                        >(
                            `/configuracion-usuario-rol/findAccessByUsuarioId/${user.id_usuario}`
                        );


                    if (!activo) {
                        return;
                    }


                    const aplicacionesActuales =
                        respuesta.data
                            .aplicaciones
                            .map(
                                (
                                    aplicacionActual
                                ) =>
                                    appsOptions.find(
                                        (
                                            opcion
                                        ) =>
                                            opcion.codigo ===
                                            aplicacionActual.codigo
                                    ) ??
                                    aplicacionActual
                            );


                    const rolesActuales =
                        respuesta.data
                            .roles
                            .map(
                                (
                                    rol
                                ) => ({
                                    ...rol,

                                    default:
                                        rol.default ===
                                        true
                                })
                            );


                    setSelectedApps(
                        aplicacionesActuales
                    );


                    setSelectedRoles(
                        rolesActuales
                    );


                    await cargarRoles(
                        aplicacionesActuales,
                        rolesActuales
                    );
                } catch (
                    errorPeticion
                ) {
                    if (
                        activo
                    ) {
                        setError(
                            obtenerMensajeError(
                                errorPeticion
                            )
                        );
                    }
                } finally {
                    if (
                        activo
                    ) {
                        setCargando(
                            false
                        );
                    }
                }
            }


            void cargar();


            return () => {
                activo =
                    false;
            };
        },
        [
            user.id_usuario,
            appsOptions
        ]
    );


    async function handleAppsChange(
        aplicaciones:
            FiltroAplicacion[]
    ) {
        setError(
            null
        );


        setSelectedApps(
            aplicaciones
        );


        await cargarRoles(
            aplicaciones,
            selectedRoles
        );
    }


    function handleRolesChange(
        roles:
            RolConfigUsuario[]
    ) {
        let siguiente =
            roles;


        if (
            siguiente.length >
                0 &&
            !siguiente.some(
                (
                    rol
                ) =>
                    rol.default
            )
        ) {
            siguiente =
                siguiente.map(
                    (
                        rol,
                        index
                    ) => ({
                        ...rol,

                        default:
                            index ===
                            0
                    })
                );
        }


        setSelectedRoles(
            siguiente
        );


        setError(
            null
        );
    }


    function handleDefaultRoleChange(
        code:
            string
    ) {
        setSelectedRoles(
            (
                actuales
            ) =>
                actuales.map(
                    (
                        rol
                    ) => ({
                        ...rol,

                        default:
                            rol.codigo ===
                            code
                    })
                )
        );
    }


    function validar():
        boolean {
        setError(
            null
        );


        if (
            selectedApps.length ===
            0
        ) {
            setError(
                "Selecciona al menos una aplicación."
            );

            return false;
        }


        if (
            selectedRoles.length ===
            0
        ) {
            setError(
                "Selecciona al menos un rol."
            );

            return false;
        }


        if (
            !selectedRoles.some(
                (
                    rol
                ) =>
                    rol.default
            )
        ) {
            setError(
                "Selecciona un rol principal."
            );

            return false;
        }


        for (
            const aplicacion
            of selectedApps
        ) {
            const tieneRol =
                selectedRoles.some(
                    (
                        rol
                    ) =>
                        rol.aplicacion_codigo ===
                        aplicacion.codigo
                );


            if (
                !tieneRol
            ) {
                setError(
                    `Selecciona al menos un rol para ${aplicacion.nombre}.`
                );

                return false;
            }
        }


        return true;
    }


    async function guardar() {
        if (
            !validar()
        ) {
            return;
        }


        const confirmado =
            window.confirm(
                "¿Confirmas la actualización de roles y accesos del usuario?"
            );


        if (
            !confirmado
        ) {
            return;
        }


        setGuardando(
            true
        );

        setError(
            null
        );


        try {
            await api.put(
                `/configuracion-usuario-rol/updateAccessByUsuarioId/${user.id_usuario}`,
                {
                    roles:
                        selectedRoles.map(
                            (
                                rol
                            ) => ({
                                id_rol:
                                    rol.id_rol,

                                default:
                                    rol.default
                            })
                        )
                }
            );


            onSaved();
        } catch (
            errorPeticion
        ) {
            setError(
                obtenerMensajeError(
                    errorPeticion
                )
            );
        } finally {
            setGuardando(
                false
            );
        }
    }


    return (
        <div
            className="user-action-overlay"
            onMouseDown={(
                evento
            ) => {
                if (
                    evento.target ===
                        evento.currentTarget &&
                    !guardando
                ) {
                    onClose();
                }
            }}
        >
            <section
                className="user-action-modal user-access-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="user-access-title"
            >
                <header className="user-action-header">
                    <div className="user-action-icon access">
                        <ShieldCheck
                            size={
                                20
                            }
                        />
                    </div>


                    <div className="user-action-heading">
                        <span>
                            Gestión de accesos
                        </span>


                        <h2
                            id="user-access-title"
                        >
                            Roles y aplicaciones
                        </h2>


                        <p>
                            Administra las aplicaciones y permisos asignados a la cuenta.
                        </p>
                    </div>


                    <button
                        type="button"
                        className="user-action-close"
                        onClick={
                            onClose
                        }
                        disabled={
                            guardando
                        }
                        aria-label="Cerrar"
                    >
                        <X
                            size={
                                18
                            }
                        />
                    </button>
                </header>


                <div className="user-action-body">
                    <div className="user-action-user">
                        <strong>
                            {
                                user.nombre
                            }
                        </strong>


                        <span>
                            {
                                user.correo
                            }
                        </span>
                    </div>


                    <div className="user-access-notice">
                        <ShieldCheck
                            size={
                                16
                            }
                        />


                        <span>
                            Los cambios de permisos se validan nuevamente en cada sesión. Si modificas un rol, el usuario deberá iniciar sesión nuevamente para utilizar sus nuevos permisos.
                        </span>
                    </div>


                    {cargando ? (
                        <div className="user-action-loading">
                            Cargando accesos...
                        </div>
                    ) : (
                        <>
                            <StepUserRoles
                                appsOptions={
                                    appsOptions
                                }
                                rolesOptions={
                                    rolesOptions
                                }
                                selectedApps={
                                    selectedApps
                                }
                                selectedRoles={
                                    selectedRoles
                                }
                                onAppsChange={
                                    handleAppsChange
                                }
                                onRolesChange={
                                    handleRolesChange
                                }
                                onDefaultRoleChange={
                                    handleDefaultRoleChange
                                }
                            />


                            {cargandoRoles && (
                                <div className="user-access-loading-roles">
                                    Actualizando roles disponibles...
                                </div>
                            )}
                        </>
                    )}


                    {error && (
                        <div className="user-action-error">
                            {
                                error
                            }
                        </div>
                    )}
                </div>


                <footer className="user-action-footer">
                    <button
                        type="button"
                        className="user-action-btn secondary"
                        onClick={
                            onClose
                        }
                        disabled={
                            guardando
                        }
                    >
                        Cancelar
                    </button>


                    <button
                        type="button"
                        className="user-action-btn primary"
                        onClick={
                            guardar
                        }
                        disabled={
                            cargando ||
                            cargandoRoles ||
                            guardando
                        }
                    >
                        <Save
                            size={
                                16
                            }
                        />


                        {guardando
                            ? "Guardando..."
                            : "Guardar accesos"}
                    </button>
                </footer>
            </section>
        </div>
    );
}