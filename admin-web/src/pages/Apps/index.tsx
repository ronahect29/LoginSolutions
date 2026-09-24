import { useState } from "react";
import { useApps } from "../../hooks/useApps";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { AppsForm } from "./AppsForm";

export function AppsPage() {
    const { items, loading, create, update, remove } = useApps();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const editingRole = items.find((r) => Number(r.id) === editingId) || null;

    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Aplicaciones</h2>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setShowForm(true);
                    }}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
                >
                    Nueva Aplicación
                </button>
            </div>

            {showForm && (
                <AppsForm
                    initial={editingRole || undefined}
                    onCancel={() => setShowForm(false)}
                    onSave={async (data, id) => {
                        if (id) {
                            await update(id, data);
                        } else {
                            await create(data);
                        }
                        setShowForm(false);
                        setEditingId(null);
                    }}
                />
            )}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-slate-500">
                                <th className="py-2 text-left">ID</th>
                                <th className="text-left">Nombre</th>
                                <th className="text-left">Descripción</th>
                                <th className="text-left">Estado</th>
                                <th className="text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((r) => (
                                <tr key={r.id} className="border-b last:border-none">
                                    <td className="py-2">{r.id}</td>
                                    <td>{r.name}</td>
                                    <td>{r.description}</td>
                                    <td>{r.activo ? "Activo" : "Inactivo"}</td>
                                    <td className="text-right space-x-2">
                                        <button
                                            className="px-2 py-1 rounded border text-xs"
                                            onClick={() => {
                                                setEditingId(Number(r.id));
                                                setShowForm(true);
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
                                            onClick={() => remove(Number(r.id))}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-4 text-center text-slate-400 text-sm"
                                    >
                                        No hay aplicaciones aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
