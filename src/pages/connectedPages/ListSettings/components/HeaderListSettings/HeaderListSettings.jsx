import React from 'react'
import { FiChevronLeft } from "react-icons/fi";

export default function HeaderListSettings({ onClick }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={onClick}
        className="p-3 bg-card border rounded-2xl text-clip-1"
      >
        <FiChevronLeft size={24} />
      </button>
      <h1 className="text-2xl font-black uppercase tracking-tight text-clip">
        Réglages
      </h1>
    </div>
  );
}
