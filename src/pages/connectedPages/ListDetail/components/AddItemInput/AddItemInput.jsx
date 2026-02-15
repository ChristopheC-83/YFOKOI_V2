import React, { useState,  useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { addItem } from "@/services/itemService";
import { dictionaryService } from "@/services/dictionaryService";
import { useUserStore } from "@/store/user/useUserStore";
import { toast } from "sonner";

export default function AddItemInput({ listId, onItemAdded }) {
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

  async function handleAdd(text) {
    const cleanLabel = text.trim();
    if (!cleanLabel || isAdding) return;

    setIsAdding(true);
    setSuggestions([]);

    const { data, error } = await addItem({
      listId,
      label: cleanLabel,
      userId: user.id,
    });

    if (error) {
      toast.error("Impossible d'ajouter l'article");
    } else {
      onItemAdded(data);
      dictionaryService.add(cleanLabel);
      setLabel("");
      inputRef.current?.focus();
    }
    setIsAdding(false);
  }

  return (
    <div className="relative mb-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd(label);
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
              onClick={() => handleAdd(suggestion)}
              className="w-full text-left px-4 py-4 hover:bg-primary hover:text-primary-foreground transition-colors font-bold capitalize border-b border-border/50 last:border-none flex items-center justify-between"
            >
              {suggestion}
              <span className="text-[10px] opacity-50 font-normal italic">
                Suggéré
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
