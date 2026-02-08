import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiSettings } from "react-icons/fi";
import { getIconById } from "@/config/icons";

export default function ListHeader({ title, iconId, listId }) {
  const navigate = useNavigate();

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
        <span className="text-3xl text-clip-1">{getIconById(iconId)}</span>
        <h1 className="text-xl font-black uppercase tracking-tighter truncate  text-clip ">
          {title}
        </h1>
      </div>

      {/* Bouton Paramètres (placeholder pour l'instant) */}
      <button
        className="p-3 bg-card border border-border rounded-2xl shadow-sm hover:bg-primary/10 transition-colors text-clip-2"
        onClick={() => navigate(`/list/${listId}/settings`)}
      >
        <FiSettings size={24} />
      </button>
    </header>
  );
}
