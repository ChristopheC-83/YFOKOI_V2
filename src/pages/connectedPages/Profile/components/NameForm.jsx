import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/user/useUserStore";
import React, { useState } from "react";
import { FiCheck, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function NameForm() {
  const updateUser = useUserStore((state) => state.updateUser);
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);
  // console.log(user)

  const navigate = useNavigate();

  // On récupère le nom actuel (soit dans metadata, soit à la racine du store)
  const currentName =
    user?.metadata?.name ;
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  console.log("user : ", user);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Le nom est obligatoire");

    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { name: name.trim() },
    });

    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      updateUser(data.user);
      toast.success("Profil mis à jour !");
      navigate("/lists"); // On libère l'accès au dashboard
    }
    setLoading(false);
  }

  // Sécurité 1 : Si le store n'est pas prêt, on affiche un rond vide ou un mini loader
  if (!isHydrated)
    return (
      <h1 className="text-2xl font-black text-center mb-6 text-clip">
        Ton nom ? j'essaye de m'en souvenir... Attends !
      </h1>
    );

  // if (isHydrated && name === "" && currentName !== "") {
  //   setName(currentName);
  // }

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      {/* 1. Champ Nom */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground ml-1 ">
          COMMENT T'APPELER ?
        </label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ton petit nom..."
            className="w-full bg-input border-2 border-transparent focus:border-primary/50 py-4 px-5 rounded-2xl outline-none transition-all font-medium text-lg mt-4"
          />
          {name.length > 2 && (
            <FiCheck className="absolute right-4 top-1/2  text-green-500 animate-in zoom-in" />
          )}
        </div>
      </div>

      {/* 2. Rappel Email (Read-only) */}
      <div className="space-y-2 opacity-70">
        <label className="text-sm font-bold text-muted-foreground ml-1">
          TON ADRESSE MAIL
        </label>
        <div className="flex items-center gap-3 bg-muted/30 py-3 px-5 rounded-xl border border-border/50  mt-4">
          <FiMail className="text-muted-foreground" />
          <span className="font-medium truncate">{user?.email}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !name}
        className={`w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50 disabled:grayscale cursor-pointer ${name.length > 2 ? "opacity-100 " : "opacity-30 disabled:grayscale pointer-events-none"}`}
      >
        {loading ? "ENREGISTREMENT..." : "VALIDER MON PROFIL"}
      </button>
    </form>
  );
}
