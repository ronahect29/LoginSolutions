import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Shield, AppWindow } from "lucide-react";

const baseClass =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-slate-100 transition";
const activeClass = "bg-slate-900 text-white hover:bg-slate-900";

export function Sidebar() {
    return (
        <aside className="w-64 bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <NavLink
                to="/admin"
                className={({ isActive }) =>
                    isActive ? `${baseClass} ${activeClass}` : baseClass
                }
            >
                <LayoutDashboard size={18} />
                Dashboard
            </NavLink>
            <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                    isActive ? `${baseClass} ${activeClass}` : baseClass
                }
            >
                <Users size={18} />
                Usuarios
            </NavLink>
            <NavLink
                to="/admin/roles"
                className={({ isActive }) =>
                    isActive ? `${baseClass} ${activeClass}` : baseClass
                }
            >
                <Shield size={18} />
                Roles
            </NavLink>
            <NavLink
                to="/admin/apps"
                className={({ isActive }) =>
                    isActive ? `${baseClass} ${activeClass}` : baseClass
                }
            >
                <AppWindow size={18} />
                Aplicaciones
            </NavLink>
        </aside>
    );
}
