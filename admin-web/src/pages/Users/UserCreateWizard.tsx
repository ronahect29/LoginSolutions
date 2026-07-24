import { useState } from "react";
import { api } from "../../services/api";
import type { FiltroAplicacion } from "../../models/FiltroAplicacion";
import type { FiltroRol, RolConfigUsuario } from "../../models/FiltroRol";
import { StepUserBasic } from "./wizard/StepUserBasic";
import { StepUserRoles } from "./wizard/StepUserRoles";
import { StepUserSummary } from "./wizard/StepUserSummary";
import "./styles/user-wizard.css";

interface Props {
    appsOptions: FiltroAplicacion[];
    onClose: () => void;
    onCreated: () => void;
}

type UserDraft = {
    correo: string;
    nombre: string;
    username: string;
    password: string;
    direccion: string;
    telefono: string;
};

const STEP_TITLES = [
    "Información Básica",
    "Configuración de Rol",
    "Resumen"
];

export function UserCreateWizard({ appsOptions, onClose, onCreated }: Props) {
    const [step, setStep] = useState(1);

    /* =========================
       USUARIO
       ========================= */
    const [user, setUser] = useState<UserDraft>({
        correo: "",
        nombre: "",
        username: "",
        password: "",
        direccion: "",
        telefono: ""
    });

    /* =========================
       APPS (SOLO FILTRO)
       ========================= */
    const [selectedApps, setSelectedApps] = useState<FiltroAplicacion[]>([]);

    /* =========================
       ROLES
       ========================= */
    const [rolesOptions, setRolesOptions] = useState<RolConfigUsuario[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<RolConfigUsuario[]>([]);

    /* =========================
       ROLES POR APLICACIÓN
       ========================= */
    async function fetchRolesForApps(apps: FiltroAplicacion[]) {
        setSelectedApps(apps);
        setSelectedRoles([]);

        if (apps.length === 0) {
            setRolesOptions([]);
            return;
        }

        try {
            const res = await api.post<FiltroRol[]>(
                "/rol/findByActivoAndCodigosAplicacionActivo",
                {
                    activo: true,
                    appsCodes: apps.map(a => a.codigo)
                }
            );

            setRolesOptions(
                res.data.map(role => ({
                    id_rol: role.id_rol,
                    nombre: role.nombre,
                    codigo: role.codigo,
                    default: false
                }))
            );
        } catch (err) {
            console.error("Error cargando roles", err);
        }
    }

    /* =========================
       MARCAR ROL POR DEFECTO
       ========================= */
    function handleDefaultRoleChange(roleCode: string) {
        setSelectedRoles(prev =>
            prev.map(role => ({
                ...role,
                default: role.codigo === roleCode
            }))
        );
    }

    /* =========================
       FINALIZAR REGISTRO
       ========================= */
    async function handleFinish() {
        const ok = window.confirm("¿Confirmas el registro del nuevo usuario?");
        if (!ok) return;

        try {
            await api.post("/usuarios/create", {
                user,
                roles: selectedRoles.map(r => ({
                    id_rol: r.id_rol,
                    codigo: r.codigo,
                    default: r.default
                }))
            });

            onCreated();
        } catch (err) {
            console.error("Error creando usuario", err);
            alert("No se pudo registrar el usuario");
        }
    }

    return (
        <div className="uw-overlay">
            <div className="uw-card">
                {/* ================= HEADER ================= */}
                <div className="uw-header">
                    <h2 className="uw-title">{STEP_TITLES[step - 1]}</h2>

                    <div className="uw-progress">
                        {STEP_TITLES.map((title, index) => {
                            const current = index + 1;
                            return (
                                <div
                                    key={title}
                                    className={`uw-progress-step ${step === current
                                            ? "active"
                                            : step > current
                                                ? "done"
                                                : ""
                                        }`}
                                >
                                    {title}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ================= BODY ================= */}
                <div className="uw-body">
                    {step === 1 && (
                        <StepUserBasic
                            data={user}
                            onChange={setUser}
                        />
                    )}

                    {step === 2 && (
                        <StepUserRoles
                            appsOptions={appsOptions}
                            rolesOptions={rolesOptions}
                            selectedApps={selectedApps}
                            selectedRoles={selectedRoles}
                            onAppsChange={fetchRolesForApps}
                            onRolesChange={(roles) => {
                                // si se elimina el rol default, limpiarlo
                                if (!roles.some(r => r.default) && roles.length > 0) {
                                    // opcional: forzar uno por defecto
                                    roles[0].default = true;
                                }
                                setSelectedRoles(roles);
                            }}
                            onDefaultRoleChange={handleDefaultRoleChange}
                        />
                    )}

                    {step === 3 && (
                        <StepUserSummary
                            user={user}
                            roles={selectedRoles}
                        />
                    )}
                </div>

                {/* ================= FOOTER ================= */}
                <div className="uw-footer">
                    <button className="uw-btn ghost" onClick={onClose}>
                        Cancelar
                    </button>

                    <div className="uw-footer-right">
                        {step > 1 && (
                            <button
                                className="uw-btn"
                                onClick={() => setStep(step - 1)}
                            >
                                Atrás
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                className="uw-btn primary"
                                onClick={() => setStep(step + 1)}
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                className="uw-btn primary"
                                onClick={handleFinish}
                            >
                                Finalizar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
