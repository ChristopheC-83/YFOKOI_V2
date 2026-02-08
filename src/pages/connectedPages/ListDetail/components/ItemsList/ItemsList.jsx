import React from "react";
import ItemRow from "./components/ItemRow/ItemRow";

export default function ItemsList({ items, onToggle }) {
  // Découpe logique des données
  const activeItems = items.filter((i) => !i.is_checked);
  const completedItems = items.filter((i) => i.is_checked);

  return (
    <div className="flex flex-col gap-8">
      {/* SECTION : À PRENDRE */}
      <section className="space-y-3">
        {activeItems.length > 0 ? (
          activeItems.map((item) => (
            <ItemRow key={item.id} item={item} onToggle={onToggle} />
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
          <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4 mb-4">
            ça, cest fait !
          </h2>
          <div className="space-y-2">
            {completedItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={onToggle}
                isCompleted
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
