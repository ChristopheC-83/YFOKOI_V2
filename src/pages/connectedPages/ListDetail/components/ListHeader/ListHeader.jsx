import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiSettings, FiLogOut } from "react-icons/fi";
import { getIconById } from "@/config/icons";
import NotificationBadge from "@/components/notificationBadge/NotificationBadge";
import { FiRefreshCw } from "react-icons/fi";
import BtnInvitation from "./components/BtnInvitation";

export default function ListHeader({
  title,
  iconId,
  listId,
  hasNotification,
  isOwner,
  onLeave,
  isRefreshing,
  onRefresh,
  shareCode,
}) {
  const navigate = useNavigate();
  // console.log(hasNotification);

  return (
    <header className="flex items-center justify-between mb-4">
      {/* Bouton Retour */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/lists")}
          className="p-3 bg-card border border-border rounded-2xl shadow-sm hover:bg-muted transition-colors text-clip-1 cursor-pointer"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`p-3 bg-card border border-border rounded-2xl shadow-sm hover:bg-muted cursor-pointer transition-all text-clip-2 ${isRefreshing ? "opacity-50" : ""}`}
        >
          <FiRefreshCw
            size={20}
            className={isRefreshing ? "animate-spin" : ""}
          />
        </button>
      </div>
      {/* Titre & Icône Centrés */}
      <div className="w-full flex flex-wrap items-center text-center px-4 gap-3 justify-center">
        <span className="text-2xl text-clip-1">{getIconById(iconId)}</span>
        <h1 className="text-xl font-black uppercase tracking-tighter truncate  text-clip ">
          {title}
        </h1>
      </div>

      {/* Action Droite : Settings/Share pour l'Owner OU Leave pour l'Invité */}
      {isOwner ? (
        <div className="flex items-center gap-2">
          <BtnInvitation title={title} shareCode={shareCode} />
          <button
            className="p-3 bg-card border border-border rounded-2xl shadow-sm hover:bg-primary/10 transition-colors relative cursor-pointer text-clip-1"
            onClick={() => navigate(`/list/${listId}/settings`)}
          >
            <FiSettings size={24} />
            {hasNotification && <NotificationBadge />}
          </button>
        </div>
      ) : (
        <button
          className="p-3 bg-card border rounded-2xl shadow-sm hover:bg-red-500/10  border-red-500/20 transition-colors cursor-pointer text-clip-2"
          onClick={onLeave}
          title="Quitter la liste"
        >
          <FiLogOut size={24} />
        </button>
      )}
    </header>
  );
}
