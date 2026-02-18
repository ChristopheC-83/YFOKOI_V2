/* eslint-disable no-unused-vars */
import React, { useState,  useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { addItem } from "@/services/itemService";
import { dictionaryService } from "@/services/dictionaryService";
import { useUserStore } from "@/store/user/useUserStore";
import { toast } from "sonner";

export default function AddItemInput({ listId }) {
  const [label, setLabel] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const user = useUserStore((state) => state.user);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setLabel(val);
    setSuggestions(dictionaryService.search(val));
  };

  const handleSelectSuggestion = (word) => {
    // 1. On remplit l'input avec la suggestion
    setLabel(word);

    // 2. On ferme le menu des suggestions
    setSuggestions([]);

    // 3. On redonne le focus à l'input pour qu'elle puisse continuer à taper
   setTimeout(() => {
     inputRef.current?.focus();
   }, 0);
  };

  async function handleSubmitFinal(text) {
    const cleanLabel = text.trim();
    if (!cleanLabel || isAdding) return;

    setIsAdding(true);

    try {
      // Le service addItem s'occupe déjà d'envoyer à Supabase
      // ET de mettre à jour le useAppStore.
      const { data, error } = await addItem({
        listId,
        label: cleanLabel,
        userId: user.id,
      });

      if (error) {
        toast.error("Erreur d'ajout");
      } else {
        // SUCCÈS
        dictionaryService.add(cleanLabel);
        setLabel(""); // On vide l'input
        setSuggestions([]);
        toast.success(`${cleanLabel} ajouté !`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Crash lors de l'ajout");
    } finally {
      // ON ARRÊTE L'ANIMATION QUOI QU'IL ARRIVE
      setIsAdding(false);
      // On redonne le focus pour l'article suivant
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }

  return (
    <div className="relative mb-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitFinal(label);
        }}
        className="relative z-20"
      >
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={handleChange}
          placeholder="Ajouter un article..."
          disabled={isAdding}
          className="w-full bg-card border-2 border-border focus:border-primary/50 py-3 px-4 rounded-2xl outline-none font-bold text-lg shadow-xl transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!label.trim() || isAdding}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-xl shadow-lg active:scale-90 transition-transform disabled:grayscale"
        >
          <FiPlus size={28} className={isAdding ? "animate-spin" : ""} />
        </button>
      </form>

      {/* MENU SUGGESTIONS (Dessous maintenant) */}
      {suggestions.length > 0 && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button" // Important pour ne pas trigger le submit du form
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-4 hover:bg-primary/10 transition-colors font-bold capitalize border-b border-border/50 last:border-none flex items-center justify-between"
            >
              {suggestion}
              <span className="text-[10px] opacity-30">
                cliquer pour remplir
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
