// services/profileService.js

import { supabase } from "@/lib/supabase";
import useAppStore from "@/store/useAppStore";

export async function fetchMissingProfiles(ids) {
  const { links, updateLinks } = useAppStore.getState();

  // 1. Filtrer uniquement les IDs qu'on n'a PAS encore en cache (LS)
  const missingIds = ids.filter((id) => id && !links[id]);

  if (missingIds.length === 0) return;

  // 2. Récupérer les pseudos sur Supabase
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", missingIds);

  if (error) {
    console.error("Erreur profils:", error);
    return;
  }

  // 3. Transformer [ {id, display_name} ] en { id: display_name }
  if (data) {
    const newLinks = Object.fromEntries(
      data.map((p) => [p.id, p.display_name]),
    );
    updateLinks(newLinks);
  }
}
