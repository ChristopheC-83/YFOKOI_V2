import React from 'react'
import CreateListButton from '../CreateListButton/CreateListButton';
import { FiPlus } from "react-icons/fi";

export default function NoListFrame({ onClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-card/50 border-2 border-dashed border-border rounded-[2rem] px-6">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <FiPlus className="text-primary w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Aucune liste pour le moment</h2>
      <p className="text-muted-foreground mb-8 max-w-xs">
        Commence par créer ta première liste de courses pour ne plus rien
        oublier.
      </p>
      <CreateListButton
        textButton={"CRÉER MA PREMIÈRE LISTE"}
        onClick={onClick}
      />
    </div>
  );
}
