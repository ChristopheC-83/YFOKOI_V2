import React from "react";
import { FiTrash2 } from "react-icons/fi";

export default function ItemRow({ item, onToggle, isCompleted, onDelete }) {
  // console.log(item, isCompleted);
  return (
    <div
      className={`flex items-center gap-4 px-1.5 py-1 rounded-2xl border border-border transition-all  shadow cursor-pointer
        ${isCompleted ? "opacity-60 shadow-destructive bg-secondary/30" : " active:scale-[0.98] shadow-secondary/40 bg-primary/20 "}  `}
    >
      {/* Zone cliquable pour le Checkbox + Label */}
      <div
        onClick={() => onToggle(item)}
        className="flex flex-1 items-center gap-4 "
      >
        {/* Checkbox custom */}
        <div
          className={`size-5 rounded-xl border-2 flex items-center justify-center transition-all 
          ${item.is_checked ? "bg-primary border-primary" : "border-muted-foreground/50"}`}
        >
          {item.is_checked && (
            <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in duration-200" />
          )}
        </div>

        {/* Contenu de l'item */}
        <div className="flex flex-col">
          <span
            className={`font-bold text-md truncate ${isCompleted ? "line-through decoration-2 " : ""}`}
          >
            {item.label}
          </span>
          {/* {item.category && !isCompleted && (
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              {item.category}
            </span>
          )} */}
        </div>
      </div>

      {/* Bouton de suppression (apparaît au hover sur desktop ou reste discret sur mobile) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Pour ne pas déclencher le toggle
          onDelete(item.id);
        }}
        className="p-1 text-destructive   "
      >
        <FiTrash2 size={20} />
      </button>
    </div>
  );
}
