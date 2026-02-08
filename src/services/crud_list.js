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
 * Récupère toutes les listes d'un utilisateur
 */
export async function fetchUserLists() {
  return await supabase
    .from("lists")
    .select("*")
    .order("created_at", { ascending: false });
}

/**
 * Récupère les détails d'une seule liste par son ID
 */
export async function fetchListById(id) {
  return await supabase
    .from("lists")
    .select("*")
    .eq("id", id)
    .single();
}


/**
 * Supprime une liste par son ID
 */
export async function deleteList(listId) {
  const { error } = await supabase
    .from("lists")
    .delete()
    .eq("id", listId);
  
  return { error };
}

/**
 * Met à jour les informations d'une liste (Titre, Icône, etc.)
 */
export async function updateList(listId, updates) {
  return await supabase
    .from("lists")
    .update(updates)
    .eq("id", listId)
    .select()
    .single();
}
