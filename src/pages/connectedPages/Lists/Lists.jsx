import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/user/useUserStore";
import { supabase } from "@/lib/supabase";
import { FiPlus } from "react-icons/fi";
import Avatar from "../Profile/components/Avatar";
import CreateListModal from "./components/CreateListModal/CreateListModal";

export default function Lists() {
  const user = useUserStore((state) => state.user);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. On récupère les listes au montage
  useEffect(() => {
    async function fetchLists() {
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setLists(data);
      setLoading(false);
    }
    fetchLists();
  }, []);

  const userName = user?.user_metadata?.name || "Toi";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      {/* HEADER : L'identité visuelle */}
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-clip uppercase tracking-tight">
            Salut, {userName} !
          </h1>
          <p className="text-muted-foreground font-medium mt-2">
            {lists.length > 0
              ? `Tu as ${lists.length} liste${lists.length > 1 ? "s" : ""} en cours.`
              : "Prêt à organiser tes listes ?"}
          </p>
        </div>
        <Avatar className="w-16 h-16 md:w-20 md:h-20" />
      </header>

      {/* BODY : Gestion des états */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : lists.length === 0 ? (
        /* EMPTY STATE : Le moment de briller */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card/50 border-2 border-dashed border-border rounded-[2rem] px-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <FiPlus className="text-primary w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Aucune liste pour le moment
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xs">
            Commence par créer ta première liste de courses pour ne plus rien
            oublier.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground font-black px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FiPlus className="w-6 h-6" />
            CRÉER MA PREMIÈRE LISTE
          </button>
        </div>
      ) : (
        /* GRID : Tes listes (on s'en occupe juste après) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* On mappera les listes ici */}
        </div>
      )}
      <CreateListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={(newList) => setLists([newList, ...lists])}
      />
    </div>
  );
}
