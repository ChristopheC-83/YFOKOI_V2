import { useUserStore } from "@/store/user/useUserStore";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import Avatar from "./components/Avatar";
import NameForm from "./components/NameForm";

export default function Profile() {
  const { logout } = useUserStore();
  const navigate = useNavigate();


  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Pseudo Avatar avec ton dégradé signature */}
      <Avatar  />

      <div className="w-full max-w-md bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <h1 className="text-2xl font-black text-center mb-6 text-clip">
          MON PROFIL
        </h1>
        {/* 2. Formulaire Nom et rappel Email */}
        <NameForm
        />

        {/* 3. Déconnexion (Visible uniquement sur mobile < md dans cette config, 
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
