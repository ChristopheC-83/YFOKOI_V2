import { useUserStore } from "@/store/user/useUserStore";
import React from "react";
import { FiUser } from "react-icons/fi";

export default function Avatar() {
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);

  // Sécurité 1 : Si le store n'est pas prêt, on affiche un rond vide ou un mini loader
  if (!isHydrated)
    return <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />;

  // Sécurité 2 : On cherche le nom partout (metadata ou racine)
  const name = user?.user_metadata?.name || user?.name;
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="relative group">
      <div className="size-22 md:size-30 rounded-full bg-clip flex items-center justify-center text-white text-4xl md:text-5xl font-black shadow-xl shadow-primary/20 png-shadow">
        {initial}
      </div>
      <div className="absolute -bottom-2 -right-2 bg-background p-2 rounded-full border-2 border-border">
        <FiUser className="text-primary text-sm" />
      </div>
    </div>
  );
}
