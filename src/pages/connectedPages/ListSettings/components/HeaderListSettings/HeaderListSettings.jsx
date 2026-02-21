import React from "react";
import { FiChevronLeft, FiRefreshCw } from "react-icons/fi";

export default function HeaderListSettings({
  onClick,
  onRefresh,
  isRefreshing,
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onClick}
          className="p-3 bg-card border rounded-2xl text-clip-1 active:scale-95 transition-transform"
          aria-label="Retour"
        >
          <FiChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight text-clip">
          Réglages
        </h1>
      </div>

      {/* Bouton de Refresh à droite pour la cohérence visuelle */}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={`p-3 rounded-2xl border bg-card transition-all active:scale-90 ${
          isRefreshing ? "opacity-50" : "text-clip-2"
        }`}
      >
        <FiRefreshCw
          size={20}
          className={`${isRefreshing ? "animate-spin" : ""}`}
        />
      </button>
    </div>
  );
}
