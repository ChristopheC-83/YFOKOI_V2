import { supabase } from "@/lib/supabase";
import useAppStore from "@/store/useAppStore";

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

export async function syncAndStoreItems(listId, currentUserId) {
  const store = useAppStore.getState();

  // 1. Fetch des items bruts depuis Supabase
  const { data: rawItems, error } = await supabase
    .from("items")
    .select("*")
    .eq("list_id", listId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!rawItems) return;

  // 2. Identification des auteurs dont on n'a pas encore le nom (Links)
  // On regarde dans store.links qui est déjà là
  const missingIds = [...new Set(rawItems.map((i) => i.created_by))].filter(
    (id) => id && id !== currentUserId && !store.links[id],
  );

  let updatedLinks = { ...store.links };

  // 3. Récupération des noms manquants en une seule fois (Batch)
  if (missingIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", missingIds);

    if (profiles) {
      profiles.forEach((p) => {
        updatedLinks[p.id] = p.username;
      });
      // On met à jour le store des pseudos
      store.updateLinks(updatedLinks);
    }
  }

  // 4. Décoration des items avec le authorName final
  const enrichedItems = rawItems.map((item) => ({
    ...item,
    authorName:
      item.created_by === currentUserId
        ? null
        : updatedLinks[item.created_by] || "...",
  }));

  // 5. Enregistrement final dans le Store (et donc en LS automatiquement)
  store.setItems(listId, enrichedItems);
}