import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

import type { MenuItem } from "../../models/MenuItem";
import "../../styles/Headers.css";

interface Props {
    open: boolean;
    items: MenuItem[];
    onClose: () => void;
}

export function SideMenu({
    open,
    items,
    onClose,
}: Props) {
    useEffect(() => {
        if (!open) {
            return;
        }

        function handleKeyDown(
            event: KeyboardEvent
        ) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        const overflowAnterior =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                overflowAnterior;

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [open, onClose]);

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
                        initial={{ x: -320 }}
                        animate={{ x: 0 }}
                        exit={{ x: -320 }}
                        transition={{
                            duration: 0.24,
                            ease: "easeOut",
                        }}
                    >
                        <div className="side-menu-header">
                            <div className="side-menu-brand">
                                <div className="side-menu-logo">
                                    A
                                </div>

                                <div className="side-menu-brand-text">
                                    <strong>
                                        Administración
                                    </strong>

                                    <span>
                                        Menú principal
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="close-btn"
                                onClick={onClose}
                                aria-label="Cerrar menú"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="side-menu-nav">
                            {items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end
                                    onClick={onClose}
                                    className={({
                                        isActive,
                                    }) =>
                                        isActive
                                            ? "menu-link active"
                                            : "menu-link"
                                    }
                                >
                                    {item.icon && (
                                        <span className="menu-link-icon">
                                            {item.icon}
                                        </span>
                                    )}

                                    <span>
                                        {item.label}
                                    </span>
                                </NavLink>
                            ))}
                        </nav>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}