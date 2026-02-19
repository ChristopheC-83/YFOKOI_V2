import { useState } from "react";
import { useUserStore } from "@/store/user/useUserStore";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiChevronRight, FiBook } from "react-icons/fi";
import Avatar from "./components/Avatar";
import NameForm from "./components/NameForm";
import { toast } from "sonner";
import { dictionaryService } from "@/services/dictionaryService";
import DictionaryModal from "./components/DictionnaryModal";
import { ModeToggle } from "@/components/provider/ModeToggle";

export default function Profile() {
  const { logout } = useUserStore();
  const navigate = useNavigate();
  // const user = useUserStore((state) => state.user);
  // console.log("user :", user);

  // --- States pour le Dico ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dictionaryWords, setDictionaryWords] = useState(() => {
    const words = dictionaryService.get();
    return [...words].sort((a, b) => a.localeCompare(b));
  });
  // Charger les mots au montage

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate("/login");
  };

  // Action Chirurgicale (Supprimer un mot)
  const handleDeleteWord = (word) => {
    const updated = dictionaryWords.filter((w) => w !== word);
    dictionaryService.set(updated);
    setDictionaryWords(updated);
    toast.success(`"${word}" supprimé`);
  };

  // Action Bulldozer (Tout vider)
  const handleClearDictionary = () => {
    if (window.confirm("Voulez-vous vraiment TOUT supprimer ?")) {
      dictionaryService.clear();
      setDictionaryWords([]);
      setIsModalOpen(false);
      toast.success("Dictionnaire réinitialisé");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]  animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-evenly w-full max-w-md mb-6">
        <Avatar />
        <ModeToggle/>
      </div>

      <div className="w-full max-w-md bg-card p-3 md:p-5 rounded-2xl border border-border shadow-sm space-y-4">
        <h1 className="text-2xl font-black text-center text-clip">
          MON PROFIL
        </h1>

        <NameForm />

        {/* --- ACCÈS CHIRURGICAL --- */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
            Personnalisation
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-between p-4 bg-muted/30 border border-border rounded-2xl hover:bg-muted/50 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FiBook size={20} />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm uppercase">
                  Dictionnaire
                </span>
                <span className="text-xs text-muted-foreground">
                  {dictionaryWords.length} mots enregistrés
                </span>
              </div>
            </div>
            <FiChevronRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* --- ZONE DE DANGER (Bulldozer) --- */}
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl">
          <h3 className="text-destructive font-bold mb-1 uppercase text-[10px] tracking-widest">
            Zone de danger
          </h3>
          <button
            onClick={handleClearDictionary}
            className="w-full py-3 text-destructive hover:bg-destructive/10 text-xs font-black rounded-xl transition-colors uppercase tracking-tighter"
          >
            Réinitialiser complètement le dico
          </button>
        </div>

        {/* Déconnexion Mobile */}
        <div className="pt-4 border-t border-border md:hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-destructive transition-colors font-bold text-sm"
          >
            <FiLogOut />
            <span>DÉCONNEXION</span>
          </button>
        </div>
      </div>

      {/* MODALE CHIRURGICALE */}
      {isModalOpen && (
        <DictionaryModal
          words={dictionaryWords}
          onDelete={handleDeleteWord}
          onClearAll={handleClearDictionary}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
