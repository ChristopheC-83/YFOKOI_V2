/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useUserStore } from "@/store/user/useUserStore";
import Navbar from "@/components/navbar/Navbar";
// import InstallPWA from "@/InstallPWA";
import Loader from "@/components/loaders/Loader";

export default function Layout() {
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((bool) => bool.isHydrated);

  if (!isHydrated) return <Loader />;

  return (
    <div className="min-h-dvh  w-vw overflow-hidden ">
      <Toaster position="top-center" richColors expand={false} />
      <main className="w-vw min-h-dvh flex max-md:flex-col md:pl-44 md:pr-3 overflow-hidden bg-background text-foreground pb-40">
        {/* <InstallPWA /> */}
        <Navbar />
        <div className="flex flex-col w-full">
          
          <Outlet />
        </div>
      </main>
    </div>
  );
}
