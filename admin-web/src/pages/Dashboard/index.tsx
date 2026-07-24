import { useEffect, useState } from "react";
import { type TotalEntidades } from "../../models/EntidadesDto";
import { api } from "../../services/api";
import "../../styles/Dashboard.css";

export function DashboardPage() {
    const [totales, setTotales] = useState<TotalEntidades>();
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        async function getTotalEntidades() {
            const uri = "/datos/getTotalEntidadesByActivo/true";
            try {
                const res = await api.get<TotalEntidades>(uri);
                setTotales(res.data);
            } finally {
                setLoading(false);
            }
        }

        getTotalEntidades();
    }, []);

    return (
        loading ? (
            <div>
                <h2 className="dashboard-card-title">Cargando...</h2>
            </div>
        ) : (
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h2 className="dashboard-card-title">Usuarios</h2>
                    <p className="dashboard-card-value">
                        {totales?.total_usuarios ?? "—"}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h2 className="dashboard-card-title">Roles</h2>
                    <p className="dashboard-card-value">
                        {totales?.total_roles ?? "—"}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h2 className="dashboard-card-title">Aplicaciones</h2>
                    <p className="dashboard-card-value">
                        {totales?.total_apps ?? "—"}
                    </p>
                </div>
            </div>
        )
    );
}
