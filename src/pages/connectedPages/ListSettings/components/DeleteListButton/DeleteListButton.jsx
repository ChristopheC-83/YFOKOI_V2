import React from "react";
import { FiChevronLeft, FiTrash2, FiEdit3, FiUsers } from "react-icons/fi";

export default function DeleteListButton({ onClick }) {
  return (
    <section className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 mt-10 mb-40">
      <button
        onClick={onClick}
        className="w-full justify-center flex items-center gap-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-bold"
      >
        <FiTrash2 />
        Supprimer définitivement
      </button>
    </section>
  );
}
