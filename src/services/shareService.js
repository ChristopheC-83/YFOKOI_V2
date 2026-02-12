/* eslint-disable no-unused-vars */
import { supabase } from "@/lib/supabase";

export async function joinListByCode(code) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Vous devez être connecté");

  // 1. Trouver la liste par son code (Maintenant possible grâce au SQL ci-dessus)
  const { data: list, error: listError } = await supabase
    .from("lists")
    .select("id, title, owner_id")
    .eq("share_code", code)
    .single();

  if (listError || !list) {
    throw new Error("Désolé, ce code ne correspond à aucune liste.");
  }

  if (list.owner_id === user.id) {
    throw new Error("C'est déjà votre liste ! 😅");
  }

  // 2. Créer la demande de partage avec le statut 'pending'
  const { data, error: shareError } = await supabase
    .from("list_shares")
    .insert([
      {
        list_id: list.id,
        user_id: user.id,
        role: "read", // Sera modifiable par l'auteur à la validation
        status: "pending", // L'utilisateur n'a pas encore accès !
      },
    ])
    .select()
    .single();

  if (shareError) {
    if (shareError.code === "23505") {
      throw new Error(
        "Demande déjà envoyée ou vous faites déjà partie de la liste.",
      );
    }
    throw new Error("Erreur lors de l'envoi de la demande.");
  }

  return { ...list, status: "pending" };
}
