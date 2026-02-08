import Avatar from "@/pages/connectedPages/Profile/components/Avatar";
import { useUserStore } from "@/store/user/useUserStore";
import React from "react";

export default function HeaderList({ listsLength }) {
  const user = useUserStore((state) => state.user);

  const userName = user?.user_metadata?.name || "Toi";
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-clip uppercase tracking-tight flex flex-col gap-y-2">
          <span>Salut,</span> {userName} !
        </h1>
        <p className="text-muted-foreground font-medium mt-2">
          {listsLength > 0
            ? `Tu as ${listsLength} liste${listsLength > 1 ? "s" : ""} en cours.`
            : "Prêt à organiser tes listes ?"}
        </p>
      </div>
      <Avatar className="w-16 h-16 md:w-20 md:h-20" />
    </header>
  );
}
