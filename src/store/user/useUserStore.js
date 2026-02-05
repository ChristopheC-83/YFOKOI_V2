import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isHydrated: false,
      isAuth: false,

      login: (userData) =>
        set({
          user: userData,
          isAuth: true,
        }),

      logout: () => {
        set({
          user: null,
          isAuth: false,
        });
      },

      setUser: (userData) =>
        set({
          user: userData,
          isAuth: Boolean(userData),
        }),

      updateUser: (newData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...newData } : null,
        })),

      // HELPERS : Très utile pour éviter les erreurs de lecture
      getUserId: () => get().user?.id || null,

      setHasHydrated: (state) => set({ isHydrated: state }),
    }),
    {
      name: "YFOKOI8V2_USER_STORE",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    },
  ),
);