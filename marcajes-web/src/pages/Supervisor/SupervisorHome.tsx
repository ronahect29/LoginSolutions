import { Link } from "react-router-dom";

export function SupervisorHome() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Panel del Supervisor</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/supervisor/repositorio-marcajes"
                        className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                    >
                        <h3 className="text-lg font-medium">📂 Repositorio de Marcajes</h3>
                        <p className="text-sm text-gray-500">
                            Consulta, filtra y descarga marcajes
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
