import React from "react";
import { ModalInvitation } from "./components/ModalInvitation";

export default function Sharing({ list }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-3 shadow-sm">
      <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
        Collaboration
      </h2>

      {/* On utilise la modal que tu as aimée sur A.R.C. */}
      <ModalInvitation list={list} />
    </section>
  );
}
 