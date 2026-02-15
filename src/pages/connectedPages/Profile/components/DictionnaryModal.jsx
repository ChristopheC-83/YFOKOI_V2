import React from "react";
import { FiX, FiTrash2 } from "react-icons/fi";

export default function DictionaryModal({
  words,
  onDelete,
  onClearAll,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background w-full max-w-md rounded-3xl p-6 shadow-2xl border animate-in slide-in-from-bottom duration-300">
        {/* Header de la modale */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black uppercase tracking-tighter">
            Édition du Dico
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <FiX size={24} />
          </button>
        </div>

        {/* Corps : La liste scrollable */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar transition-all duration-30">
          {words.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {words.map((word) => (
                <div
                  key={word}
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl border group"
                >
                  <span className="font-medium">{word}</span>
                  <button
                    onClick={() => onDelete(word)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-10 text-muted-foreground italic">
              Ton dictionnaire est vide.
            </p>
          )}
        </div>

        {/* Footer : Action de groupe */}
        {words.length > 0 && (
          <button
            onClick={onClearAll}
            className="mt-8 w-full flex items-center justify-center gap-2 py-4 text-destructive font-black uppercase tracking-widest text-xs border-t border-destructive/10 hover:bg-destructive/5 rounded-b-xl transition-colors"
          >
            <FiTrash2 size={16} />
            Tout réinitialiser
          </button>
        )}
      </div>
    </div>
  );
}
