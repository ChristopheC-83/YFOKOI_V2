import React from "react";
import { getIconById } from "@/config/icons";
import { FiChevronRight } from "react-icons/fi";

export default function ListCard({ list, onClick }) {
  // On récupère l'icône via notre helper
  const Icon = getIconById(list.icon);

  return (
    <button
      onClick={() => onClick(list.id)}
      className="group relative w-full bg-card border border-border/90 p-1 rounded-2xl flex items-center gap-5 transition-all hover:scale-[1.02] shadow-2xl active:scale-[0.98] text-left cursor-pointer"
    >
      {/* L'icône avec un cercle de fond stylé */}
      <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {Icon}
      </div>

      {/* Infos de la liste */}
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-black truncate uppercase tracking-tight">
          {list.title}
        </h3>
       
      </div>

      {/* Flèche d'indication */}
      <div className="text-muted-foreground group-hover:translate-x-1 transition-transform">
        <FiChevronRight size={24} />
      </div>
    </button>
  );
}
