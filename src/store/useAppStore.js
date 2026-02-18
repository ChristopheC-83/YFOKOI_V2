import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchUserLists, fetchListById } from "@/services/crud_list";
import { supabase } from "@/lib/supabase";
import { fetchMissingProfiles } from "@/services/profileService";

const useAppStore = create(
  persist(
    (set, get) => ({
      // --- DATA ---
      lists: [],
      items: {}, // { listId: [item1, item2] }
      links: {}, // { userId: username }
      loading: false,

      // --- ACTIONS SUR LES LISTES (Tes fonctions recyclées) ---
      // Dans ton useAppStore.js
      loadLists: async (silent = false) => {
        if (!silent) set({ loading: true });
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const data = await fetchUserLists(user.id); // Ton fetch actuel

          set({ lists: data, loading: false });

          // --- LA MAGIE EST ICI ---
          // On récupère tous les IDs de proprios des listes reçues
          const allOwnerIds = data.map((l) => l.owner_id);
          // On lance la récupération des noms (sans 'await' pour ne pas bloquer l'UI)
          fetchMissingProfiles(allOwnerIds);
        } catch (error) {
          set({ loading: false });
          console.error(error);
        }
      },

      refreshList: async (listId) => {
        try {
          const { data, error } = await fetchListById(listId);
          if (error) throw error;
          if (data) {
            set((state) => ({
              lists: state.lists.some((l) => l.id === listId)
                ? state.lists.map((l) => (l.id === listId ? data : l))
                : [...state.lists, data],
            }));
          }
        } catch (error) {
          console.error("Erreur refresh liste :", error);
        }
      },

      // --- ACTIONS SUR LES ITEMS & LINKS (Le nouveau moteur) ---
      setItems: (listId, data) =>
        set((state) => ({
          items: { ...state.items, [listId]: data },
        })),

      updateLinks: (newLinks) =>
        set((state) => ({
          links: { ...state.links, ...newLinks },
        })),

      // --- HELPERS ---
      addList: (newList) =>
        set((state) => ({ lists: [newList, ...state.lists] })),
      removeListFromStore: (id) =>
        set((state) => ({ lists: state.lists.filter((l) => l.id !== id) })),
      getListById: (id) => get().lists.find((list) => list.id === id),
      updateListInStore: (id, updates) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id ? { ...list, ...updates } : list,
          ),
        })),

      clearStore: () =>
        set({ lists: [], items: {}, links: {}, loading: false }),
    }),
    {
      name: "yfokoi-app-storage", // La clé magique en LocalStorage
    },
  ),
);

export default useAppStore;
