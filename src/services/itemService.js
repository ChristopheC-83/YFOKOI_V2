import { supabase } from "@/lib/supabase";

/**
 * Récupère les détails d'une seule liste par son ID
 */
export async function fetchListById(id) {
  return await supabase.from("lists").select("*").eq("id", id).single();
}

export async function fetchItems(listId) {
  return await supabase
    .from("items")
    .select("*")
    .eq("list_id", listId)
    .order("label", { ascending: true })
    .order("created_at", { ascending: true });
}

export async function addItem({ listId, label, userId, category = "divers" }) {
  const { data, error } = await supabase
    .from("items")
    .insert([
      {
        list_id: listId,
        label: label.trim(),
        created_by: userId,
        category: category,
        is_checked: false,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function toggleItemStatus(itemId, currentStatus) {
  return await supabase
    .from("items")
    .update({ is_checked: !currentStatus })
    .eq("id", itemId)
    .select()
    .single();
}

/**
 * Supprime un article de la liste
 */
export async function deleteItem(itemId) {
  const { error } = await supabase.from("items").delete().eq("id", itemId);

  return { error };
}

//  supprimer les elements faits
export async function deleteCheckedItems(listId) {
  return await supabase
    .from("items")
    .delete()
    .eq("list_id", listId)
    .eq("is_checked", true);
}
