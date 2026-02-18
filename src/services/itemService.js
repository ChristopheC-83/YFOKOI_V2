import { supabase } from "@/lib/supabase";
import useAppStore from "@/store/useAppStore";
import { fetchMissingProfiles } from "./profileService";
import { fetchListById } from "./crud_list";


export async function addItem({ listId, label, userId, category = "divers" }) {
  const { data, error } = await supabase
    .from("items")
    .insert([{
      list_id: listId,
      label: label.trim(),
      created_by: userId,
      category: category,
      is_checked: false,
    }])
    .select().single();

  if (data && !error) {
    const store = useAppStore.getState();
    const current = store.items[listId] || [];
    store.setItems(listId, [...current, data]); // Mise à jour instantanée du store
  }
  return { data, error };
}

export async function toggleItemStatus(item) {
  const newStatus = !item.is_checked;

  // Mise à jour de la DB
  const { data, error } = await supabase
    .from("items")
    .update({ is_checked: newStatus })
    .eq("id", item.id)
    .select().single();

  if (data && !error) {
    const store = useAppStore.getState();
    const updatedItems = store.items[item.list_id].map(i => 
      i.id === item.id ? data : i
    );
    store.setItems(item.list_id, updatedItems);
  }
  return { data, error };
}

export async function deleteItem(itemId, listId) {
  const { error } = await supabase.from("items").delete().eq("id", itemId);

  if (!error) {
    const store = useAppStore.getState();
    const filtered = store.items[listId]?.filter((i) => i.id !== itemId);
    store.setItems(listId, filtered);
  }
  return { error };
}

export async function deleteCheckedItems(listId) {
  // 1. On demande à Supabase de supprimer tous les items cochés de cette liste
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("list_id", listId)
    .eq("is_checked", true);

  if (!error) {
    // 2. Si c'est OK en base, on nettoie le store
    const store = useAppStore.getState();
    const currentItems = store.items[listId] || [];
    
    // On ne garde que ceux qui ne sont PAS cochés
    const remainingItems = currentItems.filter(item => !item.is_checked);
    
    // Mise à jour atomique du store
    store.setItems(listId, remainingItems);
  }

  return { error };
}


export async function syncAndStoreItems(listId) {
  const store = useAppStore.getState();

  // 1. Récupération des items bruts
  const { data: rawItems, error } = await supabase
    .from("items")
    .select("*")
    .eq("list_id", listId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!rawItems) return;

  // 2. Lancer la récupération des noms manquants (Async, ne bloque pas)
  const authorIds = [...new Set(rawItems.map((i) => i.created_by))];
  fetchMissingProfiles(authorIds);

  // 3. Mise à jour du store
  // Les items seront automatiquement persistés dans le LocalStorage
  store.setItems(listId, rawItems);
}

// services/itemService.js

export async function refreshListAndItems(id) {
  // On récupère le store sans être dans un composant
  const store = useAppStore.getState(); 

  try {
    // 1. On lance les deux en parallèle pour gagner du temps
    const [listRes, itemsRes] = await Promise.all([
      fetchListById(id),
      supabase.from("items").select("*").eq("list_id", id).order("created_at", { ascending: true })
    ]);

    // 2. On met à jour le store d'un coup
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