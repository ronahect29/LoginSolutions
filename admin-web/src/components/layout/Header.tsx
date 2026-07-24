import { useState } from "react";
import { SideMenu } from "./SideMenu";
import type { MenuItem } from "../../models/MenuItem";
import "../../styles/Headers.css";
import { useSession } from "../../hooks/useSession";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  appTitle: string;
  menuItems: MenuItem[];
}

export function Header({ appTitle, menuItems }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { usuario, logout } = useSession();
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }
  return (
    <>
      <header className="app-header">
        <button className="menu-btn" onClick={() => setOpen(true)}>
          ☰
        </button>

        <h1 className="app-title">{appTitle}</h1>

        <div className="header-user">
          <span>{usuario?.nombre}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <SideMenu
        open={open}
        items={menuItems}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
