import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function DeleteListModal({
  isOpen,
  onClose,
  onConfirm,
  listTitle,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-sm bg-card border-2 border-destructive/20 rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
            <FiAlertTriangle size={32} />
          </div>

          <h2 className="text-xl font-black uppercase mb-2">
            Supprimer la liste ?
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Tu es sur le point de supprimer{" "}
            <span className="text-foreground font-bold italic">
              "{listTitle}"
            </span>{" "}
            et tous ses articles. Cette action est irréversible.
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              className="w-full bg-destructive text-destructive-foreground font-black py-4 rounded-2xl active:scale-95 transition-all"
            >
              OUI, SUPPRIMER TOUT
            </button>
            <button
              onClick={onClose}
              className="w-full bg-muted font-bold py-4 rounded-2xl active:scale-95 transition-all"
            >
              ANNULER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
