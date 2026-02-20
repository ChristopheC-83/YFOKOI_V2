/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { supabase } from "@/lib/supabase"; // Ton instance
import { useUserStore } from "@/store/user/useUserStore";
import Navbar from "@/components/navbar/Navbar";
import Loader from "@/components/loaders/Loader";
import InstallPWA from "@/InstallPWA";

export default function Layout() {
  const { user, setUser, isHydrated } = useUserStore();

  useEffect(() => {
    // 1. On check la session au chargement initial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. ON ÉCOUTE L'AUTH : C'est ici que le "Magic Link" déclenche le login !
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log("🛠️ Supabase Event:", event);
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  // Tant que Zustand n'a pas lu le localStorage, on attend.
  if (!isHydrated) return <Loader />;

  return (
    <div className="min-h-dvh w-full overflow-hidden bg-background text-foreground font-sans">
      {/* <InstallPWA /> */}
      <Toaster position="top-center" richColors />
      <main className="flex max-md:flex-col md:pl-44 md:pr-3 min-h-dvh">
        <Navbar />
        <div className="flex flex-col w-full py-6 px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
