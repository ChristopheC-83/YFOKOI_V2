import { supabase } from "@/lib/supabase";
import useAppStore from "@/store/useAppStore";
import { fetchListById } from "./crud_list";

/**
 * AJOUTER UN ITEM
 * On insère et on récupère immédiatement le display_name pour le store.
 */
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
    .select(`*, profiles:created_by(display_name)`)
    .single();

  if (data && !error) {
    const store = useAppStore.getState();
    const current = store.items[listId] || [];
    store.setItems(listId, [...current, data]);
  }
  return { data, error };
}

/**
 * COCHER / DECOCHER
 * On ré-embarque le profil à chaque update pour ne pas perdre l'affichage du nom.
 */
export async function toggleItemStatus(item) {
  const newStatus = !item.is_checked;

  const { data, error } = await supabase
    .from("items")
    .update({ is_checked: newStatus })
    .eq("id", item.id)
    .select(`*, profiles:created_by(display_name)`)
    .single();

  if (data && !error) {
    const store = useAppStore.getState();
    const updatedItems = store.items[item.list_id].map((i) =>
      i.id === item.id ? data : i,
    );
    store.setItems(item.list_id, updatedItems);
  }
  return { data, error };
}

/**
 * SUPPRIMER UN ITEM
 */
export async function deleteItem(itemId, listId) {
  const { error } = await supabase.from("items").delete().eq("id", itemId);

  if (!error) {
    const store = useAppStore.getState();
    const filtered = store.items[listId]?.filter((i) => i.id !== itemId);
    store.setItems(listId, filtered);
  }
  return { error };
}

/**
 * NETTOYER LES ITEMS COCHÉS
 */
export async function deleteCheckedItems(listId) {
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("list_id", listId)
    .eq("is_checked", true);

  if (!error) {
    const store = useAppStore.getState();
    const currentItems = store.items[listId] || [];
    const remainingItems = currentItems.filter((item) => !item.is_checked);
    store.setItems(listId, remainingItems);
  }
  return { error };
}

/**
 * SYNCHRONISATION INITIALE
 * On récupère tout d'un coup. Fini le fetchMissingProfiles.
 */
export async function syncAndStoreItems(listId) {
  const store = useAppStore.getState();

  const { data: rawItems, error } = await supabase
    .from("items")
    .select(`*,profiles (display_name)`)
    .eq("list_id", listId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!rawItems) return;

  store.setItems(listId, rawItems);
}

/**
 * REFRESH GLOBAL (Liste + Items)
 */
export async function refreshListAndItems(id) {
  const store = useAppStore.getState();

  try {
    const [listRes, itemsRes] = await Promise.all([
      fetchListById(id),
      supabase
        .from("items")
        .select(`*,profiles (display_name)`)
        .eq("list_id", id)
        .order("created_at", { ascending: true }),
    ]);

    if (listRes.data) {
      store.updateListInStore(id, listRes.data);
    }
    if (itemsRes.data) {
      store.setItems(id, itemsRes.data);
    }
  } catch (err) {
    console.error("Erreur lors du refresh global:", err);
  }
}
