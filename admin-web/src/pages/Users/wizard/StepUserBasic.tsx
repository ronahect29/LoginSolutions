interface Props {
    data: any;
    onChange: (v: any) => void;
}

export function StepUserBasic({ data, onChange }: Props) {
    function update(field: string, value: string) {
        onChange({ ...data, [field]: value });
    }
    return (
        <div className="uw-step">
            <h3>Información Básica</h3>
            {["nombre", "correo", "username", "password", "direccion", "telefono"].map(f => (
                <div className="uf-field" key={f}>
                    <label>{f}</label>
                    <input type={f === "password" ? "password" : "text"}
                        value={(data as any)[f]}
                        onChange={e => update(f, e.target.value)}
                    />
                </div>
            ))}
        </div>
    );
};