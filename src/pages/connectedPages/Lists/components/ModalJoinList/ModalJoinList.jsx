import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiPlusCircle, FiHash } from "react-icons/fi"; // Ton service de hier
import { toast } from "sonner";
import { joinListByCode } from "@/services/shareService";

export function ModalJoinList({ refreshLists }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (code.length < 4) return toast.error("Code trop court");

    setLoading(true);
    try {
      await joinListByCode(code);
      toast.success("Liste rejointe !");
      setIsOpen(false);
      setCode("");
      refreshLists(); // On recharge les listes pour voir la nouvelle
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className=" w-1/3 min-w-31.25 bg-secondary text-primary-foreground font-black  flex items-center justify-center rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all gap-2 cursor-pointer mb-2 text-md">
          <FiHash className="size-5 text-primary-foreground shrink-0 text-md " />
          Rejoindre !
        </button>
      </DialogTrigger>

      <DialogContent className="rounded-[2rem] max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase italic">
            Rejoindre une liste
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleJoin} className="space-y-6 mt-4" noValidate>
          <div className="relative">
            <input
              type="text"
              
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Entrez le code (ex: 98293029)"
              className="w-full bg-secondary/50 border-2 border-transparent focus:border-primary rounded-2xl py-5 px-6 text-center text-2xl font-black tracking-widest outline-none transition-all"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !code}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? "Vérification..." : "REJOINDRE MAINTENANT"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
