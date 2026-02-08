import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/user/useUserStore";
import { toast } from "sonner";
import { AVAILABLE_ICONS } from "@/config/icons";

export default function CreateListModal({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("FiList");
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    // Le share_code est généré par le SQL (si tu as mis le DEFAULT)
    // Sinon on laisse Supabase gérer.
    const { data, error } = await supabase
      .from("lists")
      .insert([{ title: title.trim(), owner_id: user.id, icon: selectedIcon }])
      .select()
      .single();

    if (error) {
      toast.error("Impossible de créer la liste");
    } else {
      toast.success("Liste créée !");
      onCreated(data); // On remonte l'info au parent pour MAJ l'UI
      setTitle("");
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-24 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 relative animate-in slide-in-from-top-8 duration-300">
        <h2 className="text-2xl font-black mb-6 uppercase">Nouvelle Liste</h2>

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
            <div className="grid grid-cols-4 gap-3">
              {AVAILABLE_ICONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIcon(item.id)}
                  className={`flex items-center justify-center p-4 rounded-2xl text-2xl transition-all border-2 ${
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
            className="w-full bg-primary text-primary-foreground font-black py-5 rounded-2xl shadow-xl shadow-primary/20"
          >
            {loading ? "CRÉATION..." : "C'EST PARTI !"}
          </button>
        </form>
      </div>
    </div>
  );
}
