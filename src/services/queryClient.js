import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// On configure le client avec des options par défaut "solides"
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // On garde en cache 24h
      staleTime: 1000 * 60 * 5, // Les données sont considérées "fraîches" 5 min
      retry: 2, // On réessaye 2 fois si ça échoue
    },
  },
});

export const persister = createSyncStoragePersister({
  storage: window.localStorage,
});
