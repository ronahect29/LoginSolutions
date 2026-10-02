interface SummaryUser {
    nombre: string;
    correo: string;
    username: string;
    direccion: string;
    telefono: string;
}

interface SummaryApp {
    codigo: string;
    nombre?: string;
}

interface SummaryRole {
    codigo: string;
    nombre?: string;
    default: boolean;
}

interface Props {
    user: SummaryUser;
    apps: SummaryApp[];
    roles: SummaryRole[];
}

export function StepUserSummary({
    user,
    apps,
    roles,
}: Props) {
    return (
        <div className="uw-step">
            <div className="uw-step-intro">
                <h3>
                    Revisa la información
                </h3>

                <p>
                    Confirma los datos antes de crear
                    la cuenta.
                </p>
            </div>

            <div className="uw-summary-grid">
                <div className="uw-summary-card">
                    <span>
                        Nombre
                    </span>

                    <strong>
                        {user.nombre}
                    </strong>
                </div>

                <div className="uw-summary-card">
                    <span>
                        Correo
                    </span>

                    <strong>
                        {user.correo}
                    </strong>
                </div>

                <div className="uw-summary-card">
                    <span>
                        Usuario
                    </span>

                    <strong>
                        {user.username}
                    </strong>
                </div>

                <div className="uw-summary-card">
                    <span>
                        Teléfono
                    </span>

                    <strong>
                        {user.telefono ||
                            "No especificado"}
                    </strong>
                </div>

                <div className="uw-summary-card uw-summary-wide">
                    <span>
                        Dirección
                    </span>

                    <strong>
                        {user.direccion ||
                            "No especificada"}
                    </strong>
                </div>
            </div>

            <div className="uw-summary-section">
                <h4>
                    Aplicaciones
                </h4>

                <div className="uw-summary-pills">
                    {apps.map(
                        (app) => (
                            <span
                                key={
                                    app.codigo
                                }
                                className="uw-summary-pill"
                            >
                                {
                                    app.codigo
                                }
                            </span>
                        )
                    )}
                </div>
            </div>

            <div className="uw-summary-section">
                <h4>
                    Roles asignados
                </h4>

                <div className="uw-summary-pills">
                    {roles.map(
                        (role) => (
                            <span
                                key={
                                    role.codigo
                                }
                                className={`uw-summary-pill ${
                                    role.default
                                        ? "primary"
                                        : ""
                                }`}
                            >
                                {
                                    role.codigo
                                }

                                {role.default &&
                                    " · Principal"}
                            </span>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}