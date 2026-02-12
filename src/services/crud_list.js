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
 * La RLS s'occupe de ne renvoyer que ce que l'user a le droit de voir.
 */
export async function fetchUserLists(userId) {
  if (!userId) return [];

  // On récupère tout ce que la RLS nous autorise
  // (La RLS filtrera déjà pour ne donner que tes listes + tes partages)
  const { data, error } = await supabase
    .from("lists")
    .select(
      `
      *,
      list_shares(status, user_id)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  // On filtre localement pour être DOUBLEMENT sûr (Sécurité Client)
  return data.filter(
    (list) =>
      list.owner_id === userId ||
      list.list_shares?.some((s) => s.user_id === userId),
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
        user_id
      )
    `,
    ) 
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
 * Met à jour les informations d'une liste (Titre, Icône, etc.)
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

export async function acceptShareRequest(listId, guestId) {
  const { data, error } = await supabase
    .from("list_shares")
    .update({ status: "accepted" })
    .eq("list_id", listId)
    .eq("user_id", guestId)
    .select(); // On récupère la ligne pour confirmer au store

  if (error) {
    console.error("Erreur validation partage:", error);
    throw error;
  }
  return data[0];
}