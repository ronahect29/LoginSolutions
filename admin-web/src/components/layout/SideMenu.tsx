import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import type { MenuItem } from "../../models/MenuItem";
import "../../styles/Headers.css";

interface Props {
  open: boolean;
  items: MenuItem[];
  onClose: () => void;
}

export function SideMenu({ open, items, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="menu-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            className="side-menu"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.25 }}
          >
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>

            <nav>
              {items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    isActive ? "menu-link active" : "menu-link"
                  }
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
