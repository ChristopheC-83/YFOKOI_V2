
import React from "react";
import { useUserStore } from "@/store/user/useUserStore";
import NavbarDesktop from "./NavbarDesktop/NavbarDesktop";
import NavbarMobile from "./NavbarMobile/NavbarMobile";

export default function Navbar() {
  const {  user, isHydrated } = useUserStore();




  // Si le store n'est pas encore prêt, on ne rend rien ou un squelette
  // pour éviter le "flash" de contenu non connecté
  if (!isHydrated) return null;
  console.log("user : ", user)

  return (
    <div className="bg-background text-foreground">
      <div className="hidden md:block  ">
        <NavbarDesktop user={user} />
      </div>
      <div className="block md:hidden fixed bottom-0 left-0 w-full border-t bg-muted text-muted-foreground z-50">
        <NavbarMobile user={user} />
      </div>
    </div>
  );
}
