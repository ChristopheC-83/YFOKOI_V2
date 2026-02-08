import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { addItem } from "@/services/itemService";
import { useUserStore } from "@/store/user/useUserStore";
import { toast } from "sonner";

export default function AddItemInput({ listId, onItemAdded }) {
  const [label, setLabel] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const user = useUserStore((state) => state.user);

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanLabel = label.trim();
    if (!cleanLabel || isAdding) return;

    setIsAdding(true);
    const { data, error } = await addItem({
      listId,
      label: cleanLabel,
      userId: user.id,
    });

    if (error) {
      console.error("ERREUR SUPABASE DETAIL:", error);
      toast.error("Impossible d'ajouter l'article");
    } else {
      onItemAdded(data); // On remonte l'item au parent (ListDetail)
      setLabel(""); // On vide le champ
    }
    setIsAdding(false);
  }

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Ajouter un article..."
        disabled={isAdding}
        className="w-full bg-card border-2 border-border focus:border-primary/50 py-2 px-3 rounded-2xl outline-none font-bold text-lg shadow-xl transition-all disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!label.trim() || isAdding}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-2xl shadow-lg active:scale-90 transition-transform disabled:grayscale"
      >
        <FiPlus size={30} className={isAdding ? "animate-spin" : ""} />
      </button>
    </form>
  );
}
