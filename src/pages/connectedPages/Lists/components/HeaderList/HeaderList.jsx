import Avatar from "@/pages/connectedPages/Profile/components/Avatar";
import { useUserStore } from "@/store/user/useUserStore";
import React from "react";
import { FiRefreshCw } from "react-icons/fi"; // L'icône standard

export default function HeaderList({ listsLength, onRefresh, isRefreshing }) {
  const user = useUserStore((state) => state.user);
  const userName = user?.display_name || "Toi";

  return (
    <header className="flex items-center justify-between mb-6 px-2">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-clip uppercase tracking-tight flex flex-col ">
          <span>Salut,</span> {userName} !
        </h1>

        {/* Ligne de statut avec bouton refresh */}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-muted-foreground font-medium">
            {listsLength > 0
              ? `Tu as ${listsLength} liste${listsLength > 1 ? "s" : ""} en cours.`
              : "Prêt à organiser tes listes ?"}
          </p>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-1.5 hover:bg-muted rounded-lg transition-all active:scale-90 ${
              isRefreshing ? "opacity-50" : "text-primary"
            }`}
            title="Actualiser les listes"
          >
            <FiRefreshCw
              size={16}
              className={`${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>
      <Avatar className="size-14 md:size-16 border-2 border-border" />
    </header>
  );
}
