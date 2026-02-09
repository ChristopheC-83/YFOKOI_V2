/* eslint-disable no-unused-vars */
import { supabase } from "@/lib/supabase";

export async function joinListByCode(code) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Vous devez être connecté");

  // 1. Trouver la liste par son code + vérifier le propriétaire
  const { data: list, error: listError } = await supabase
    .from("lists")
    .select("id, title, owner_id") // On récupère l'owner_id pour vérifier
    .eq("share_code", code)
    .single();

  if (listError || !list) {
    throw new Error("Désolé, ce code ne correspond à aucune liste.");
  }

  // 2. EMPÊCHER L'AUTO-PARTAGE : Si tu es le proprio, pas besoin de rejoindre
  if (list.owner_id === user.id) {
    throw new Error(
      "C'est déjà votre liste ! Elle est sur votre écran d'accueil.",
    );
  }

  // 3. Ajouter l'utilisateur à list_shares
  const { data, error: shareError } = await supabase
    .from("list_shares")
    .insert([
      {
        list_id: list.id,
        user_id: user.id,
        role: "read", // On démarre en 'read' par sécurité
      },
    ])
    .select()
    .single();

  if (shareError) {
    // Erreur 23505 = Contrainte d'unicité (déjà rejoint)
    if (shareError.code === "23505") {
      throw new Error("Vous collaborez déjà sur cette liste.");
    }
    throw new Error("Impossible de rejoindre la liste pour le moment.");
  }

  return list;
}
