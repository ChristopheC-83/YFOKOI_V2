import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user/useUserStore";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { USERS_LINKS, VISITORS_LINKS } from "@/config/navigation";
import { supabase } from "@/lib/supabase"; // Importe ton client supabase

export default function NavbarDesktop() {
  // On récupère tout au même endroit : le store
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  // Logique de liens simplifiée
  const links = user ? USERS_LINKS : VISITORS_LINKS;

  async function handleLogout() {
    // Règle d'or du CTO : On déconnecte d'abord le serveur, puis le client
    await supabase.auth.signOut();
    logout();
    navigate("/login");
  }

  return (
    <nav className="px-4 my-2 min-w-40 flex flex-col gap-3 fixed top-0 left-0">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              cn(
                "flex gap-x-2 items-center px-3 py-2 rounded-lg transition-all font-medium",
                "hover:text-secondary-foreground hover:bg-accent",
                isActive && "bg-secondary text-foreground font-bold shadow-sm",
              )
            }
          >
            {Icon && <Icon className="w-5 h-5" />}
            <span>{link.label}</span>
          </NavLink>
        );
      })}

      {/* Utilisation de la variable 'user' directement, c'est plus fiable */}
      {user && (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      )}
    </nav>
  );
}
