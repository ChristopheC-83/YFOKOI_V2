import React from "react";
import { FiChevronLeft, FiTrash2, FiEdit3, FiUsers } from "react-icons/fi";

export default function Sharing({ list }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-6 shadow-sm opacity-50">
      <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
        Collaboration (Bientôt) pour {list.title}
      </h2>
      <div className="flex items-center gap-3 p-3">
        <FiUsers className="text-primary" />
        <span className="font-bold italic">Partager avec un proche</span>
      </div>
    </section>
  );
}
