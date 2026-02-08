import React from 'react'
import { FiPlus } from "react-icons/fi";

export default function CreateListButton({ textButton, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-primary-foreground font-black px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer mb-2"
    >
      <FiPlus className="w-6 h-6" />
      {textButton.toUpperCase()}
    </button>
  );
}
