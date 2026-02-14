/* eslint-disable no-unused-vars */
import { supabase } from "@/lib/supabase";

export async function joinListByCode(code) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Vous devez être connecté");

  // 1. Trouver la liste par son code
  const { data: list, error: listError } = await supabase
    .from("lists")
    .select("id, title, owner_id")
    .eq("share_code", code)
    .single();

  if (listError || !list) {
    throw new Error("Désolé, ce code ne correspond à aucune liste.");
  }

  // Sécurité : Un propriétaire ne peut pas s'auto-inviter
  if (list.owner_id === user.id) {
    throw new Error("C'est déjà votre liste ! 😅");
  }

  // 2. Créer la demande de partage
  const { data, error: shareError } = await supabase
    .from("list_shares")
    .insert([
      {
        list_id: list.id,
        invited_id: user.id, // CORRECT : C'est lui l'invité
        shared_by: list.owner_id, // OPTIONNEL : On marque que c'est une demande liée à cette liste
        role: "read", // Défini dans tes constantes
        status: "pending", // Attente de validation par l'owner
      },
    ])
    .select()
    .single();

  if (shareError) {
    // Erreur 23505 = Violation de la contrainte UNIQUE (list_id, invited_id)
    if (shareError.code === "23505") {
      throw new Error(
        "Demande déjà envoyée ou vous faites déjà partie de cette liste.",
      );
    }
    console.error("Erreur Supabase Shared:", shareError);
    throw new Error("Erreur lors de l'envoi de la demande.");
  }

  return { ...list, status: "pending" };
}
