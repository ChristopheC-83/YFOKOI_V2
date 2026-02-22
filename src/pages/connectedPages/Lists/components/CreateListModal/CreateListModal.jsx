import React, { useState } from "react";
import { useUserStore } from "@/store/user/useUserStore";
import { toast } from "sonner";
import { AVAILABLE_ICONS } from "@/config/icons";
import { createList } from "@/services/crud_list";
import useAppStore from "@/store/useAppStore";

export default function CreateListModal({ isOpen, onClose }) {
  const addListToStore = useAppStore((state) => state.addList);
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("FiList");
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) return;

    setLoading(true);

    try {
      // Appel au service Supabase
      const { data, error } = await createList({
        title: title.trim(),
        icon: selectedIcon,
        userId: user.id,
      });

      if (error) throw error;

      // MAGIE : On met à jour le store global
      // Plus besoin de "onCreated(data)", le store prévient tout le monde
      addListToStore(data);

      toast.success("Liste créée avec succès !");
      setTitle("");
      onClose();
    } catch (error) {
      console.error("[CREATE_LIST_ERROR]:", error.message);
      toast.error("Erreur : impossible de créer la liste");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 md:pt-24 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl p-4 relative animate-in slide-in-from-top-8 duration-300">
        <h2 className="text-2xl font-black mb-6 uppercase text-center">Nouvelle Liste</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Titre */}
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground ml-1">
              NOM DE LA LISTE
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-input border-2 border-transparent focus:border-primary/50 py-4 px-6 rounded-2xl outline-none font-bold text-xl mt-2"
              placeholder="Ex: Courses..."
              enterKeyHint="done"
            />
          </div>

          {/* Sélecteur d'Icônes */}
          <div className="space-y-3">
            <label className="text-xs font-black text-muted-foreground ml-1">
              CHOISIR UN ICÔNE
            </label>
            <div className="grid grid-cols-6 gap-3">
              {AVAILABLE_ICONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIcon(item.id)}
                  className={`flex items-center justify-center p-1 py-3 cursor-pointer rounded-2xl text-2xl transition-all border-2 ${
                    selectedIcon === item.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 border-transparent hover:border-muted-foreground/30"
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full bg-primary text-primary-foreground font-black py-5 rounded-2xl shadow-xl shadow-primary/20 cursor-pointer"
          >
            {loading ? "CRÉATION..." : "C'EST PARTI !"}
          </button>
          {/*  Fermer la modale */}
          <div
            className="w-full bg-destructive cursor-pointer text-destructive-foreground font-black py-5 rounded-2xl shadow-destructive/20"
            onClick={onClose}
          >
            <p className="text-center">ANNULER</p>
          </div>
        </form>
      </div>
    </div>
  );
}
