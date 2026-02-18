import React from "react";
import { FiTrash2, FiLock } from "react-icons/fi";

export default function ItemRow({
  item,
  onToggle,
  onDelete,
  isCompleted,
  readOnly,
  userRole,
  currentUserId,
  links,
}) {
  // --- LOGIQUE DE DROITS CHIRURGICALE ---
  const isOwner = userRole === "owner";
  const isModo = userRole === "modo";

  // console.log(" links dans itemRow : ", links);

  // ATTENTION : On utilise created_by (le nom officiel en DB)
  const isCreator = item.created_by === currentUserId;

  // L'éditeur ne peut toucher qu'à ses propres créations
  const canTouch = isOwner || isModo || (userRole === "edit" && isCreator);

  // Un item est bloqué s'il est en lecture seule OU si l'utilisateur n'a pas les droits dessus
  const isDisabled = readOnly || !canTouch;

  // --- LOGIQUE D'AFFICHAGE DU NOM ---
  // On affiche le nom de l'auteur si ce n'est pas moi (et qu'on a l'info)
  const authorName = isCreator ? null : links[item.created_by] || "...";

  return (
    <div
      className={`flex items-center gap-4 px-3 py-2 rounded-2xl border border-border transition-all shadow 
        ${isCompleted ? "opacity-60 shadow-destructive bg-secondary/10" : "shadow-secondary/40 bg-primary/20"}
        ${isDisabled ? "cursor-default grayscale-[0.5]" : "cursor-pointer active:scale-[0.98]"} `}
    >
      {/* Zone d'action (Toggle) */}
      <div
        onClick={() => !isDisabled && onToggle(item)}
        className="flex flex-1 items-center gap-4 min-w-0"
      >
        {/* Checkbox Custom */}
        <div
          className={`size-5 shrink-0 rounded-xl border-2 flex items-center justify-center transition-all 
          ${item.is_checked ? "bg-primary border-primary" : "border-muted-foreground/30"}
          ${isDisabled && !item.is_checked ? "bg-muted/20 border-dashed" : ""}`}
        >
          {item.is_checked && (
            <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in duration-200" />
          )}
        </div>

        {/* Label & Meta */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-bold text-md truncate ${isCompleted ? "line-through decoration-2 opacity-50" : ""}`}
            >
              {item.label}
            </span>

            {/* AFFICHAGE DU NOM (Discret) */}
            {authorName && (
              <span className="text-[10px] text-muted-foreground/40 italic font-light shrink-0">
                de {authorName}
              </span>
            )}
          </div>

          {/* Feedback visuel pour l'éditeur sur les items des autres */}
          {userRole === "edit" && !isCreator && (
            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-muted-foreground/60">
              <FiLock size={8} /> Lecture seule
            </div>
          )}
        </div>
      </div>

      {/* Suppression : uniquement si on a le droit de modifier CET item */}
      {!isDisabled && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="p-1 text-destructive hover:scale-110 transition-transform shrink-0"
        >
          <FiTrash2 size={20} />
        </button>
      )}
    </div>
  );
}
