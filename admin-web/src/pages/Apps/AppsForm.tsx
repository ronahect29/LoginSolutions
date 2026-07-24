import { type FormEvent, useState } from "react";
import { type UpsertAppDto, type AppEntity } from "../../services/apps.service";

interface Props {
    initial?: AppEntity;
    onCancel: () => void;
    onSave: (data: UpsertAppDto, id?: number) => Promise<void>;
}

export function AppsForm({ initial, onCancel, onSave }: Props) {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [isActivo, setIsActivo] = useState(initial?.activo ?? true);
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSaving(true);

        const payload: UpsertAppDto = {
            name,
            description,
            activo: isActivo,
        };

        await onSave(payload, Number(initial?.id));
        setSaving(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border rounded-xl p-4 bg-slate-50 flex flex-col gap-3"
        >
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">Nombre</label>
                    <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">Descripción</label>
                    <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">
                        Estado
                    </label>
                    <select
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={isActivo ? "1" : "0"}
                        onChange={(e) => setIsActivo(e.target.value === "1")}
                    >
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-2 rounded-lg border text-sm"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 disabled:opacity-60"
                >
                    {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear"}
                </button>
            </div>
        </form>
    );
}
