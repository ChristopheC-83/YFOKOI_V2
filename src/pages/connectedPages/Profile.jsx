import React, { useState } from "react";
import { useUserStore } from "@/store/user/useUserStore";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiCheck, FiUser, FiMail } from "react-icons/fi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user, updateUser, logout } = useUserStore();
  const navigate = useNavigate();

  // On récupère le nom actuel (soit dans metadata, soit à la racine du store)
  const currentName = user?.user_metadata?.name || user?.name || "";
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  // Génération de l'initiale pour l'avatar
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  const handleUpdateProfile = async (e) => {
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
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Pseudo Avatar avec ton dégradé signature */}
      <div className="relative group mb-8">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[var(--text-clip-1)] to-[var(--text-clip-2)] flex items-center justify-center text-white text-4xl md:text-5xl font-black shadow-xl shadow-primary/20 png-shadow">
          {initial}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-background p-2 rounded-full border-2 border-border">
          <FiUser className="text-primary" />
        </div>
      </div>

      <div className="w-full max-w-md bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <h1 className="text-2xl font-black text-center mb-6 text-clip">
          MON PROFIL
        </h1>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* 2. Champ Nom */}
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
                <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in" />
              )}
            </div>
          </div>

          {/* 3. Rappel Email (Read-only) */}
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
            className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50 disabled:grayscale cursor-pointer"
          >
            {loading ? "ENREGISTREMENT..." : "VALIDER MON PROFIL"}
          </button>
        </form>

        {/* 4. Déconnexion (Visible uniquement sur mobile < md dans cette config, 
            ou partout si tu n'as pas de bouton dans la sidebar mobile) */}
        <div className="mt-8 pt-6 border-t border-border md:hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-4 text-destructive hover:bg-destructive/10 rounded-2xl transition-colors cursor-pointer font-bold"
          >
            <FiLogOut className="w-5 h-5" />
            <span>DÉCONNEXION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
