/* eslint-disable no-unused-vars */
import { supabase } from "@/lib/supabase";

/**
 * Crée une nouvelle liste pour l'utilisateur
 */
export async function createList({ title, icon, userId }) {
  return await supabase
    .from("lists")
    .insert([
      {
        title: title.trim(),
        icon: icon,
        owner_id: userId,
      },
    ])
    .select()
    .single();
}

/**
 * Récupère les listes (Proprio + Partagées)
 */
export async function fetchUserLists(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("lists")
    .select(
      `
      *,
      list_shares(status, invited_id)
    `,
    ) // Modification : user_id -> invited_id
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Filtrage local (invited_id mis à jour ici aussi)
  return data.filter(
    (list) =>
      list.owner_id === userId ||
      list.list_shares?.some((s) => s.invited_id === userId),
  );
}

/**
 * Récupère les détails d'une seule liste par son ID
 */
export async function fetchListById(id) {
  const { data, error } = await supabase
    .from("lists")
    .select(
      `
      *,
      list_shares (
        status,
        invited_id
      )
    `,
    ) // Modification : user_id -> invited_id
    .eq("id", id)
    .single();

  return { data, error };
}

/**
 * Supprime une liste par son ID
 */
export async function deleteList(listId) {
  const { error } = await supabase.from("lists").delete().eq("id", listId);
  return { error };
}

/**
 * Met à jour les informations d'une liste
 */
export async function updateList(listId, updates) {
  const { data, error } = await supabase
    .from("lists")
    .update(updates)
    .eq("id", listId)
    .select();

  return {
    data: data ? data[0] : null,
    error,
  };
}

/**
 * Accepte une demande de partage
 */
export async function acceptShareRequest(listId, guestId) {
  const { data, error } = await supabase
    .from("list_shares")
    .update({ status: "accepted" })
    .eq("list_id", listId)
    .eq("invited_id", guestId) // Modification : user_id -> invited_id
    .select();

  if (error) {
    console.error("Erreur validation partage:", error);
    throw error;
  }
  return data ? data[0] : null;
}
