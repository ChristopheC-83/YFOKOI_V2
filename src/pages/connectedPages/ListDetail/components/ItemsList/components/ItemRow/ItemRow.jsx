import React from "react";
import { FiTrash2 } from "react-icons/fi";

export default function ItemRow({
  item,
  onToggle,
  isCompleted,
  onDelete,
  readOnly,
}) {
  return (
    <div
      className={`flex items-center gap-4 px-1.5 py-1 rounded-2xl border border-border transition-all shadow 
        ${isCompleted ? "opacity-60 shadow-destructive bg-secondary/30" : " shadow-secondary/40 bg-primary/20 "}
        ${readOnly ? "cursor-default opacity-80" : "cursor-pointer active:scale-[0.98]"} `}
    >
      {/* Zone cliquable pour le Checkbox + Label */}
      <div
        onClick={() => !readOnly && onToggle(item)} // Sécurité : on ne toggle pas si readOnly
        className="flex flex-1 items-center gap-4"
      >
        {/* Checkbox custom */}
        <div
          className={`size-5 rounded-xl border-2 flex items-center justify-center transition-all 
          ${item.is_checked ? "bg-primary border-primary" : "border-muted-foreground/50"}
          ${readOnly && !item.is_checked ? "bg-muted/20" : ""}`} // Feedback visuel si vide et verrouillé
        >
          {item.is_checked && (
            <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in duration-200" />
          )}
        </div>

        {/* Contenu de l'item */}
        <div className="flex flex-col">
          <span
            className={`font-bold text-md truncate ${isCompleted ? "line-through decoration-2" : ""}`}
          >
            {item.label}
          </span>
        </div>
      </div>

      {/* Bouton de suppression : Uniquement si on n'est pas en readOnly */}
      {!readOnly && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="p-1 text-destructive hover:scale-110 transition-transform"
        >
          <FiTrash2 size={20} />
        </button>
      )}
    </div>
  );
}
