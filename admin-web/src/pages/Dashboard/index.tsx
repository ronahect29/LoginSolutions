import {
    AppWindow,
    ArrowRight,
    ShieldCheck,
    Users,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { type TotalEntidades } from "../../models/EntidadesDto";
import { api } from "../../services/api";
import "../../styles/dashboard.css";

export function DashboardPage() {
    const navigate = useNavigate();

    const [totales, setTotales] =
        useState<TotalEntidades>();

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);

    useEffect(() => {
        async function getTotalEntidades() {
            const uri =
                "/datos/getTotalEntidadesByActivo/true";

            try {
                const res =
                    await api.get<TotalEntidades>(
                        uri
                    );

                setTotales(res.data);
                setError(false);
            } catch (err) {
                console.error(
                    "Error al obtener los datos del dashboard:",
                    err
                );

                setError(true);
            } finally {
                setLoading(false);
            }
        }

        void getTotalEntidades();
    }, []);

    if (loading) {
        return (
            <section className="dashboard-page">
                <div className="dashboard-loading">
                    <div className="dashboard-spinner" />

                    <div>
                        <strong>
                            Cargando panel
                        </strong>

                        <span>
                            Consultando información
                            del sistema...
                        </span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="dashboard-page">
            <section className="dashboard-hero">
                <span className="dashboard-hero-kicker">
                    Gestión administrativa
                </span>

                <h1>
                    Panel de Administración
                </h1>

                <p>
                    Administra usuarios, roles y
                    aplicaciones desde un mismo espacio
                    de trabajo.
                </p>
            </section>

            <section className="dashboard-tools">
                <div className="dashboard-section-heading">
                    <h2>
                        Herramientas disponibles
                    </h2>

                    <p>
                        Selecciona una opción para
                        continuar.
                    </p>
                </div>

                {error && (
                    <div className="dashboard-error">
                        No fue posible consultar los
                        indicadores del sistema. Las
                        opciones administrativas continúan
                        disponibles.
                    </div>
                )}

                <div className="dashboard-grid">
                    <article className="dashboard-card">
                        <div className="dashboard-card-top">
                            <div className="dashboard-card-icon">
                                <Users size={24} />
                            </div>

                            <span className="dashboard-card-status">
                                Activos
                            </span>
                        </div>

                        <div className="dashboard-card-content">
                            <span className="dashboard-card-label">
                                Usuarios activos
                            </span>

                            <strong className="dashboard-card-value">
                                {totales?.total_usuarios ??
                                    "—"}
                            </strong>

                            <p>
                                Gestiona las cuentas y
                                accesos registrados en la
                                plataforma.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="dashboard-card-action"
                            onClick={() =>
                                navigate(
                                    "/admin/usuarios"
                                )
                            }
                        >
                            <span>
                                Administrar usuarios
                            </span>

                            <ArrowRight
                                size={18}
                                className="dashboard-card-arrow"
                            />
                        </button>
                    </article>

                    <article className="dashboard-card">
                        <div className="dashboard-card-top">
                            <div className="dashboard-card-icon">
                                <ShieldCheck size={24} />
                            </div>

                            <span className="dashboard-card-status">
                                Activos
                            </span>
                        </div>

                        <div className="dashboard-card-content">
                            <span className="dashboard-card-label">
                                Roles activos
                            </span>

                            <strong className="dashboard-card-value">
                                {totales?.total_roles ??
                                    "—"}
                            </strong>

                            <p>
                                Configura permisos y
                                niveles de acceso de los
                                usuarios.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="dashboard-card-action"
                            onClick={() =>
                                navigate(
                                    "/admin/roles"
                                )
                            }
                        >
                            <span>
                                Administrar roles
                            </span>

                            <ArrowRight
                                size={18}
                                className="dashboard-card-arrow"
                            />
                        </button>
                    </article>

                    <article className="dashboard-card">
                        <div className="dashboard-card-top">
                            <div className="dashboard-card-icon">
                                <AppWindow size={24} />
                            </div>

                            <span className="dashboard-card-status">
                                Activas
                            </span>
                        </div>

                        <div className="dashboard-card-content">
                            <span className="dashboard-card-label">
                                Aplicaciones activas
                            </span>

                            <strong className="dashboard-card-value">
                                {totales?.total_apps ??
                                    "—"}
                            </strong>

                            <p>
                                Administra las aplicaciones
                                disponibles dentro del
                                ecosistema.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="dashboard-card-action"
                            onClick={() =>
                                navigate(
                                    "/admin/apps"
                                )
                            }
                        >
                            <span>
                                Administrar aplicaciones
                            </span>

                            <ArrowRight
                                size={18}
                                className="dashboard-card-arrow"
                            />
                        </button>
                    </article>
                </div>
            </section>
        </section>
    );
}