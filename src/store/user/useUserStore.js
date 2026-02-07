import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      // --- ÉTAT ---
      user: null,
      isHydrated: false,

      // --- ACTIONS ---

      /**
       * Met à jour l'utilisateur (utilisé par le listener Supabase)
       */
      setUser: (userData) => {
        set({ user: userData });
      },

      /**
       * Déconnexion locale (le signOut Supabase doit être appelé en parallèle)
       */
      logout: () => {
        set({ user: null });
        // On pourrait ajouter localStorage.removeItem('yfokoi_v2_user_store')
        // si on voulait un nettoyage radical, mais persist s'en charge.
      },

      /**
       * Update partiel (ex: changer le pseudo ou l'avatar)
       */
      updateUser: (newData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...newData } : null,
        })),

      // --- HELPERS (Getters) ---

      /**
       * Récupère l'ID pour les requêtes Supabase (ex: filter by user_id)
       */
      getUserId: () => get().user?.id || null,
      hasName: () => {
        const user = get().user;
        return !!user?.user_metadata?.name;
      },

      /**
       * Retourne un booléen pour les gardiens de routes
       */
      isAuth: () => !!get().user,

      /**
       * Interne : gère l'état de lecture du storage
       */
      setHasHydrated: (state) => set({ isHydrated: state }),
    }),
    {
      name: "yfokoi_v2_user_store", // Nom de la clé dans le localStorage
      storage: createJSONStorage(() => localStorage),

      // Cette partie est CRUCIALE pour ton Loader dans le Layout
      onRehydrateStorage: () => (state) => {
        if (state) {
          // On s'assure que React a bien pris en compte l'état avant de libérer le loader
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
