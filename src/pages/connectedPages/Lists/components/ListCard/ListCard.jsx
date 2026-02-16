import React from "react";
import { getIconById } from "@/config/icons";
import { FiChevronRight } from "react-icons/fi";

export default function ListCard({ list }) {
  const Icon = getIconById(list.icon);

  return (
    <div
      className="group relative w-full bg-card border border-border/90  rounded-2xl flex items-center  transition-all hover:scale-[1.02] shadow-2xl active:scale-[0.98] text-left cursor-pointer py-1"
    >
      {/* L'icône avec un cercle de fond stylé */}
      <div className=" w-12 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {Icon}
      </div>

      {/* Infos de la liste */}
      <div className="flex-1">
        <h3 className=" font-black truncate uppercase tracking-tight ps-4">
          {list.title}
        </h3>
      </div>

      {/* Flèche d'indication */}
      <div className="w-14 flex items-center justify-center text-muted-foreground group-hover:translate-x-1 transition-transform border-l ">
        <FiChevronRight size={20} /> 
      </div>
    </div>
  );
}
