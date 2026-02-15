import { create } from "zustand";
import { fetchUserLists, fetchListById } from "@/services/crud_list"; // Ajoute l'import
import { supabase } from "@/lib/supabase";

const useListStore = create((set, get) => ({
  lists: [],
  loading: false,

  // On ajoute le paramètre "silent" (par défaut à false)
  loadLists: async (silent = false) => {
    // On ne met loading à true QUE si on n'est pas en mode silencieux
    if (!silent) set({ loading: true });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const data = await fetchUserLists(user.id);

      // On met à jour les listes et on s'assure que loading repasse à false
      set({ lists: data, loading: false });
    } catch (error) {
      console.error(error);
      set({ lists: [], loading: false });
      // Optionnel : on peut propager l'erreur pour le toast
      throw error;
    }
  },

  /**
   * REFRESH D'UNE SEULE LISTE (Crucial pour tes accès)
   * Va chercher la version fraîche en DB et remplace l'ancienne dans le state
   */
  refreshList: async (listId) => {
    try {
      const { data, error } = await fetchListById(listId);

      if (error) throw error;

      if (data) {
        set((state) => {
          const listExists = state.lists.some((list) => list.id === listId);

          if (listExists) {
            return {
              lists: state.lists.map((list) =>
                list.id === listId ? { ...data } : list,
              ),
            };
          } else {
            return {
              lists: [...state.lists, data],
            };
          }
        });
      }
    } catch (error) {
      console.error("Erreur lors du refresh de la liste :", error);
      throw error;
    }
  },

  addList: (newList) =>
    set((state) => ({
      lists: [newList, ...state.lists],
    })),

  updateListInStore: (id, updates) =>
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === id ? { ...list, ...updates } : list,
      ),
    })),

  removeListFromStore: (id) =>
    set((state) => ({
      lists: state.lists.filter((list) => list.id !== id),
    })),

  getListById: (id) => get().lists.find((list) => list.id === id),
}));

export default useListStore;
