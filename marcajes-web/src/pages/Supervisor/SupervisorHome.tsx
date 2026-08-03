import { Link } from "react-router-dom";
import "../../styles/SupervisorHome.css";

export function SupervisorHome() {
    return (
        <main className="supervisor-home">
            <section className="supervisor-welcome">
                <div>
                    <span className="supervisor-eyebrow">
                        Gestión de asistencia
                    </span>

                    <h1>Panel del Supervisor</h1>

                    <p>
                        Consulta los registros de entrada y salida de los
                        colaboradores y genera los reportes correspondientes.
                    </p>
                </div>
            </section>

            <section
                className="supervisor-options"
                aria-labelledby="supervisor-options-title"
            >
                <div className="supervisor-section-header">
                    <div>
                        <h2 id="supervisor-options-title">
                            Herramientas disponibles
                        </h2>

                        <p>
                            Selecciona una opción para continuar.
                        </p>
                    </div>
                </div>

                <div className="supervisor-card-grid">
                    <Link
                        to="/supervisor/repositorio-marcajes"
                        className="supervisor-card"
                    >
                        <div className="supervisor-card-icon">
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d="M3 6.5A2.5 2.5 0 0 1 5.5 4H9l2 2h7.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                <path
                                    d="M8 11h8M8 14h6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <div className="supervisor-card-content">
                            <h3>Repositorio de marcajes</h3>

                            <p>
                                Consulta, filtra y descarga los registros
                                de asistencia de los colaboradores.
                            </p>

                            <span className="supervisor-card-action">
                                Abrir repositorio
                                <span aria-hidden="true">→</span>
                            </span>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}