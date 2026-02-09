import { create } from "zustand";
import { fetchUserLists } from "@/services/crud_list"; // Ton service existant

const useListStore = create((set, get) => ({
  lists: [],
  loading: false,

  // Action : Charger toutes les listes depuis Supabase
  loadLists: async () => {
    set({ loading: true });
    const { data, error } = await fetchUserLists();
    if (!error) set({ lists: data });
    set({ loading: false });
  },

  // Action : Ajouter une liste (UI Optimiste)
  addListToStore: (newList) =>
    set((state) => ({ lists: [newList, ...state.lists] })),

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
