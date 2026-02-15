import React from "react";
import ItemRow from "./components/ItemRow/ItemRow";

export default function ItemsList({
  items,
  onToggle,
  onDelete,
  onClearCompleted,
  readOnly = false, // On récupère la prop du parent
}) {
  const activeItems = items.filter((i) => !i.is_checked);
  const completedItems = items.filter((i) => i.is_checked);

  return (
    <div className="flex flex-col gap-8">
      {/* SECTION : À PRENDRE */}
      <section className="space-y-3">
        {activeItems.length > 0 ? (
          activeItems.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
              readOnly={readOnly} // On transmet l'info
            />
          ))
        ) : (
          <div className="text-center py-16 px-6 border-2 border-dashed border-border rounded-[2.5rem] opacity-50">
            <p className="font-bold uppercase tracking-tight italic">
              La liste est vide 🛒
            </p>
          </div>
        )}
      </section>

      {/* SECTION : DÉJÀ PRIS */}
      {completedItems.length > 0 && (
        <section className="pt-6 border-t border-dashed border-border/50">
          <div className="w-full flex gap-3 items-center justify-between pb-2">
            <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-4">
              ça, c'est fait !
            </h2>

            {/* Condition : On ne montre le bouton "vider" que si on n'est pas en lecture seule */}
            {!readOnly && (
              <button
                onClick={onClearCompleted}
                className="text-[10px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest pb-1 transition-colors"
              >
                on vide tout ça ?
              </button>
            )}
          </div>

          <div className="space-y-2">
            {completedItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={onToggle}
                onDelete={onDelete}
                isCompleted
                readOnly={readOnly} // On transmet l'info
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
