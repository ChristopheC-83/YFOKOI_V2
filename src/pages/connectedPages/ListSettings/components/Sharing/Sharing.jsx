import React from "react";
import { FiChevronLeft, FiTrash2, FiEdit3, FiUsers } from "react-icons/fi";
import { ModalInvitation } from "./components/ModalInvitation";

export default function Sharing({ list }) {
  return (
    <section className="bg-card border border-border rounded-3xl p-6 shadow-sm">
      <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
        Collaboration
      </h2>

      {/* On utilise la modal que tu as aimée sur A.R.C. */}
      <ModalInvitation list={list} />

      {/* Optionnel : Liste des membres déjà présents (on verra ça après) */}
    </section>
  );
}
 