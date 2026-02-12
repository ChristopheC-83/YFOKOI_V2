import { useState } from "react";
import { FiCopy, FiCheck, FiShare2 } from "react-icons/fi";
import { toast } from "sonner";
import { DialogTitle } from "@/components/ui/dialog";

// On passe la liste en prop pour avoir le titre et le code
export default function Invitations({ list }) {
  const [copied, setCopied] = useState(false);

  const code = list?.share_code || "NON GÉNÉRÉ";

  const handleCopy = () => {
    if (!list?.share_code) return;

    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <DialogTitle className="flex items-center gap-2 text-xl font-black italic uppercase">
        <FiShare2 className="text-primary" />
        Inviter des proches
      </DialogTitle>

      <div className="mt-6 bg-card border-2 border-dashed border-primary/20 rounded-3xl p-8 text-center">
        <p className="text-muted-foreground text-sm mb-4">
          Partage ce code pour collaborer sur la liste <br />
          <span className="font-bold text-foreground">"{list?.title}"</span>.
        </p>

        <div className="bg-secondary/30 rounded-2xl py-6 mb-6">
          <span className="text-4xl font-black tracking-[0.2em] text-primary">
            {code}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          {copied ? (
            <FiCheck className="text-xl" />
          ) : (
            <FiCopy className="text-xl" />
          )}
          {copied ? "Copié !" : "Copier le code"}
        </button>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="font-bold text-sm text-foreground uppercase tracking-widest">
          Comment ça marche ?
        </h3>
        <ul className="text-sm text-muted-foreground space-y-3">
          <li className="flex gap-3">
            <span className="bg-primary/10 text-primary font-bold h-5 w-5 rounded-full flex items-center justify-center text-[10px]">
              1
            </span>
            Envoie ce code à tes proches.
          </li>
          <li className="flex gap-3">
            <span className="bg-primary/10 text-primary font-bold h-5 w-5 rounded-full flex items-center justify-center text-[10px]">
              2
            </span>
            Ils cliquent sur "Rejoindre" sur leur accueil.
          </li>
          <li className="flex gap-3">
            <span className="bg-primary/10 text-primary font-bold h-5 w-5 rounded-full flex items-center justify-center text-[10px]">
              3
            </span>
            Tu valides leur accés et leur possibilités d'action.
          </li>
          <li className="flex gap-3 font-bold">
            <span className="bg-primary/10 text-primary font-bold h-5 w-5 rounded-full flex items-center justify-center text-[10px] ">
              4
            </span>
            Vous avez votre liste partagée !
          </li>
        </ul>
      </div>
    </div>
  );
}
// b2bc78de
