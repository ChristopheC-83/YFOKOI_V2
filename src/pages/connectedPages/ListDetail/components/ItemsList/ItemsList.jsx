import React from "react";
import ItemRow from "./components/ItemRow/ItemRow";

export default function ItemsList({
  items,
  onToggle,
  onDelete,
  onClearCompleted,
  userRole,
  currentUserId,
  readOnly,
  // 🗑️ links supprimé ici
}) {
  const activeItems = items.filter((item) => !item.is_checked);
  const completedItems = items.filter((item) => item.is_checked);

  // ÉTAT 1 : La liste est absolument vide
  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-6 border-2 border-dashed border-border rounded-[2.5rem] opacity-50">
        <p className="font-bold uppercase tracking-widest italic text-muted-foreground">
          La liste est vide 🛒
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* SECTION : À PRENDRE */}
      <section className="space-y-2.5">
        {activeItems.length > 0 ? (
          activeItems.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
              readOnly={readOnly}
              userRole={userRole}
              currentUserId={currentUserId}
              // 🗑️ links supprimé ici
            />
          ))
        ) : (
          /* ÉTAT 2 : Tout a été coché */
          <div className="py-8 text-center bg-primary/5 rounded-[2rem] border border-primary/10">
            <p className="text-sm font-bold text-primary italic">
              Bravo, tout est dans le panier ! 🎉
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

            {/* Seuls Owner et Modo peuvent vider la liste complète des cochés */}
            {!readOnly && (userRole === "owner" || userRole === "modo") && (
              <button
                onClick={onClearCompleted}
                className="text-[10px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest pb-1 transition-colors"
              >
                on vide tout ça ?
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {completedItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={onToggle}
                onDelete={onDelete}
                isCompleted
                readOnly={readOnly}
                userRole={userRole}
                currentUserId={currentUserId}
                // 🗑️ links supprimé ici
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
