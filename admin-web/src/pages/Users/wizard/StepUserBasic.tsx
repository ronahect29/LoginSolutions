import {
    AtSign,
    KeyRound,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";

interface UserDraft {
    correo: string;
    nombre: string;
    username: string;
    password: string;
    direccion: string;
    telefono: string;
}

interface Props {
    data: UserDraft;
    onChange: (value: UserDraft) => void;
}

export function StepUserBasic({
    data,
    onChange,
}: Props) {
    function update(
        field: keyof UserDraft,
        value: string
    ) {
        onChange({
            ...data,
            [field]: value,
        });
    }

    return (
        <div className="uw-step">
            <div className="uw-step-intro">
                <h3>
                    Datos del usuario
                </h3>

                <p>
                    Ingresa la información principal de
                    la nueva cuenta.
                </p>
            </div>

            <div className="uw-form-grid">
                <div className="uf-field">
                    <label htmlFor="uw-nombre">
                        Nombre completo
                        <span>*</span>
                    </label>

                    <div className="uf-input-wrap">
                        <User size={17} />

                        <input
                            id="uw-nombre"
                            type="text"
                            value={data.nombre}
                            placeholder="Ej. Pamela Ramírez"
                            autoComplete="name"
                            onChange={(event) =>
                                update(
                                    "nombre",
                                    event.target.value
                                )
                            }
                        />
                    </div>
                </div>

                <div className="uf-field">
                    <label htmlFor="uw-correo">
                        Correo electrónico
                        <span>*</span>
                    </label>

                    <div className="uf-input-wrap">
                        <Mail size={17} />

                        <input
                            id="uw-correo"
                            type="email"
                            value={data.correo}
                            placeholder="usuario@correo.com"
                            autoComplete="email"
                            onChange={(event) =>
                                update(
                                    "correo",
                                    event.target.value
                                )
                            }
                        />
                    </div>
                </div>

                <div className="uf-field">
                    <label htmlFor="uw-username">
                        Nombre de usuario
                        <span>*</span>
                    </label>

                    <div className="uf-input-wrap">
                        <AtSign size={17} />

                        <input
                            id="uw-username"
                            type="text"
                            value={data.username}
                            placeholder="Ej. pamela.ramirez"
                            autoComplete="username"
                            onChange={(event) =>
                                update(
                                    "username",
                                    event.target.value
                                )
                            }
                        />
                    </div>
                </div>

                <div className="uf-field">
                    <label htmlFor="uw-password">
                        Contraseña
                        <span>*</span>
                    </label>

                    <div className="uf-input-wrap">
                        <KeyRound size={17} />

                        <input
                            id="uw-password"
                            type="password"
                            value={data.password}
                            placeholder="Mínimo 6 caracteres"
                            autoComplete="new-password"
                            onChange={(event) =>
                                update(
                                    "password",
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <small>
                        Debe contener al menos 6
                        caracteres.
                    </small>
                </div>

                <div className="uf-field">
                    <label htmlFor="uw-direccion">
                        Dirección
                    </label>

                    <div className="uf-input-wrap">
                        <MapPin size={17} />

                        <input
                            id="uw-direccion"
                            type="text"
                            value={data.direccion}
                            placeholder="Dirección del usuario"
                            autoComplete="street-address"
                            onChange={(event) =>
                                update(
                                    "direccion",
                                    event.target.value
                                )
                            }
                        />
                    </div>
                </div>

                <div className="uf-field">
                    <label htmlFor="uw-telefono">
                        Teléfono
                    </label>

                    <div className="uf-input-wrap">
                        <Phone size={17} />

                        <input
                            id="uw-telefono"
                            type="tel"
                            value={data.telefono}
                            placeholder="Ej. 5555-5555"
                            autoComplete="tel"
                            onChange={(event) =>
                                update(
                                    "telefono",
                                    event.target.value
                                )
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="uw-required-note">
                <span>*</span>
                Campos obligatorios
            </div>
        </div>
    );
}