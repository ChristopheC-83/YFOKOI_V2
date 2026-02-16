import React, { useState, useEffect } from "react";
import { getProfilesByIDs } from "@/services/shareService";
import WatingValidation from "./components/WaintingValidation/WatingValidation";
import LevelsManager from "./components/LevelsManager/LevelsManager";
import { Loader2 } from "lucide-react";

export default function ManageAccess({ list, onRefresh }) {
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNeededProfiles() {
      const shares = list?.list_shares || [];
      if (shares.length === 0) {
        setLoading(false);
        return;
      }

      const ids = shares.map((s) => s.invited_id);
      const { data, error } = await getProfilesByIDs(ids);

      if (error) {
        console.error(error);

        setLoading(false);

        return;
      }

      if (data) {
        const map = {};
        data.forEach((p) => (map[p.id] = p));
        setProfiles(map);
      }
      setLoading(false);
    }

    loadNeededProfiles();
  }, [list]); // Se relance quand la liste change (via onRefresh)

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );

  const pending =
    list?.list_shares?.filter((s) => s.status === "pending") || [];
  const accepted =
    list?.list_shares?.filter((s) => s.status === "accepted") || [];

  return (
    <section className="bg-card border border-border rounded-2xl p-3 shadow-sm space-y-4">
      <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
        Gestion des accès
      </h2>

      {/* On passe les données préparées aux composants de présentation */}
      <WatingValidation
        requests={pending}
        profiles={profiles}
        listId={list.id}
        onRefresh={onRefresh}
      />

      <LevelsManager
        members={accepted}
        profiles={profiles}
        listId={list.id}
        onRefresh={onRefresh}
      />
    </section>
  );
}
