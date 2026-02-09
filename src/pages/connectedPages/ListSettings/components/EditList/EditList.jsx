import React, { useState } from "react";
import { FiEdit3, FiCheck, FiLoader } from "react-icons/fi";
import { updateList } from "@/services/crud_list";
import { toast } from "sonner";
import { AVAILABLE_ICONS } from "@/config/icons";
import useListStore from "@/store/lists/useListStore";

export default function EditList({ list }) {
  // États locaux pour gérer l'édition
  const [name, setName] = useState(list.title);
  const [selectedIcon, setSelectedIcon] = useState(list.icon);
  const [loading, setLoading] = useState(false);

  // Accès à l'action du store pour mettre à jour l'UI globalement
  const updateListInStore = useListStore((state) => state.updateListInStore);

  // LOGIQUE : Bouton visible uniquement si changement réel
  const hasChanged = name !== list.title || selectedIcon !== list.icon;

  async function handleSave(e) {
    e.preventDefault();

    // Validation basique mais essentielle
    if (!name.trim()) {
      return toast.error("Le nom ne peut pas être vide");
    }

    setLoading(true);

    const updates = {
      title: name.trim(),
      icon: selectedIcon,
    };

    try {
      const { data, error } = await updateList(list.id, updates);
      console.log("data", data);

      if (error) throw error;

      // MISE À JOUR DU STORE : C'est ici que la magie opère
      // On met à jour le store global pour que l'accueil et le header changent direct
      updateListInStore(list.id, updates);

      toast.success("Réglages enregistrés !");
    } catch (error) {
      console.error("Erreur MAJ nom icone liste :", error.message);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-card border border-border rounded-[2.5rem] p-6 shadow-sm">
      <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">
        Général
      </h2>

      <form onSubmit={handleSave} className="space-y-6">
        {/* INPUT NOM : Design épuré et focus clair */}
        <div className="flex items-center gap-3 bg-muted/50 p-4 rounded-2xl border-2 border-transparent focus-within:border-primary/30 transition-all">
          <FiEdit3
            className={`transition-colors ${hasChanged ? "text-primary" : "text-muted-foreground"}`}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent font-bold outline-none flex-1 text-lg"
            placeholder="Nom de la liste..."
          />
        </div>

        {/* GRILLE D'ICÔNES : Sélection visuelle forte */}
        <div className="grid grid-cols-5 gap-2">
          {AVAILABLE_ICONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIcon(item.id)}
              className={`text-2xl p-3 rounded-xl transition-all border-2 active:scale-90 ${
                selectedIcon === item.id
                  ? "bg-primary/10 border-primary scale-110 shadow-sm"
                  : "bg-transparent border-transparent hover:bg-muted"
              }`}
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* BOUTON DE VALIDATION : Apparaît uniquement si nécessaire */}
        <div className="h-16 flex items-end">
          {" "}
          {/* Container fixe pour éviter les sauts de layout */}
          {hasChanged && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all animate-in zoom-in-95 duration-200"
            >
              {loading ? (
                <FiLoader className="animate-spin" size={20} />
              ) : (
                <>
                  <FiCheck size={20} />
                  ENREGISTRER
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
