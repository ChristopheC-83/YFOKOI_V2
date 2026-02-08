import React, { useState } from "react";
import { FiChevronLeft, FiTrash2, FiEdit3, FiUsers } from "react-icons/fi";

export default function EditList({ list }) {
  const [name, setName] = useState(list.title);

  return (
    <section className="bg-card border border-border rounded-2xl p-3 shadow-sm">
      <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
        Général
      </h2>
      <form className="w-full flex items-center justify-between p-1 hover:bg-muted rounded-xl transition-colors">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <FiEdit3 className="text-primary" />
          <span className="font-bold">Renommer</span>
        </div>
      </form>
    </section>
  );
}
