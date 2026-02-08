import { supabase } from "@/lib/supabase";

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

export async function fetchItems(listId) {
  return await supabase
    .from("items")
    .select("*")
    .eq("list_id", listId)
    .order("sort_order", { ascending: true }) // Utilisation de ta colonne de tri
    .order("created_at", { ascending: true });
}

export async function addItem({ listId, label, userId, category = "divers" }) {
  return await supabase
    .from("items")
    .insert([
      {
        list_id: listId,
        label: label.trim(),
        added_by: userId,
        category: category,
        is_checked: false,
      },
    ])
    .select()
    .single();
}

export async function toggleItemStatus(itemId, currentStatus) {
  return await supabase
    .from("items")
    .update({ is_checked: !currentStatus })
    .eq("id", itemId)
    .select()
    .single();
}
