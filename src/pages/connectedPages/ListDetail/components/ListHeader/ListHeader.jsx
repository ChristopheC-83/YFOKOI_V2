import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiSettings, FiLogOut } from "react-icons/fi";
import { getIconById } from "@/config/icons";
import NotificationBadge from "@/components/notificationBadge/NotificationBadge";

export default function ListHeader({
  title,
  iconId,
  listId,
  hasNotification,
  isOwner,
  onLeave,
}) {
  const navigate = useNavigate();
  console.log(hasNotification);

  return (
    <header className="flex items-center justify-between mb-4">
      {/* Bouton Retour */}
      <button
        onClick={() => navigate("/lists")}
        className="p-3 bg-card border border-border rounded-2xl shadow-sm hover:bg-muted transition-colors text-clip-1"
      >
        <FiChevronLeft size={24} />
      </button>

      {/* Titre & Icône Centrés */}
      <div className="w-full flex flex-wrap items-center text-center px-4 gap-3 justify-center">
        <span className="text-2xl text-clip-1">{getIconById(iconId)}</span>
        <h1 className="text-xl font-black uppercase tracking-tighter truncate  text-clip ">
          {title}
        </h1>
      </div>

      {/* Action Droite : Settings pour l'Owner OU Leave pour l'Invité */}
      {isOwner ? (
        <button
          className="p-3 bg-card border border-border rounded-2xl shadow-sm hover:bg-primary/10 transition-colors relative cursor-pointer"
          onClick={() => navigate(`/list/${listId}/settings`)}
        >
          <FiSettings size={24} />
          {hasNotification && <NotificationBadge />}
        </button>
      ) : (
        <button
          className="p-3 bg-card border rounded-2xl shadow-sm hover:bg-red-500/10 text-red-500 border-red-500/20 transition-colors cursor-pointer"
          onClick={onLeave}
          title="Quitter la liste"
        >
          <FiLogOut size={24} />
        </button>
      )}
    </header>
  );
}
