import { create } from "zustand";
import { fetchUserLists } from "@/services/crud_list";
import { supabase } from "@/lib/supabase";

const useListStore = create((set, get) => ({
  lists: [], // Toujours initialiser à un tableau vide
  loading: false,

  // Dans ton store
  loadLists: async () => {
    set({ loading: true });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const data = await fetchUserLists(user.id); // On passe l'ID ici
      set({ lists: data, loading: false });
    } catch (error) {
      console.error(error);
      set({ lists: [], loading: false });
    }
  },

  addList: (newList) =>
    set((state) => ({
      lists: [newList, ...state.lists],
    })),

  // Action : Mettre à jour une liste (Celle qu'on vient d'utiliser !)
  updateListInStore: (id, updates) =>
    set((state) => ({
      lists: state.lists.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),

  // Action : Supprimer une liste
  removeListFromStore: (id) =>
    set((state) => ({
      lists: state.lists.filter((l) => l.id !== id),
    })),

  // Sélecteur : Récupérer une seule liste par son ID
  getListById: (id) => get().lists.find((l) => l.id === id),

  
}));

export default useListStore;
