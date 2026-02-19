import React from "react";
import {
  acceptShareRequest,
  rejectShareRequest,
} from "@/services/shareService";
import { toast } from "sonner";
import { Check, X, Clock, UserCheck } from "lucide-react";

export default function WatingValidation({
  requests,
  profiles,
  listId,
  onRefresh,
}) {
  // Si aucune demande, on ne pollue pas l'écran
  if (!requests || requests.length === 0) return null;

  const handleAction = async (invitedId, action) => {
    try {
      const { error } =
        action === "accept"
          ? await acceptShareRequest(listId, invitedId)
          : await rejectShareRequest(listId, invitedId);
      // console.log("Action Result:", { action, listId, invitedId, error });

      if (error) throw error;

      toast.success(
        action === "accept" ? "Nouveau membre ajouté !" : "Demande rejetée !",
      );

      // On demande au "cerveau" (ManageAccess) de rafraîchir les données
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(`Erreur lors de l'action ${action}:`, error);
      toast.error("L'opération a échoué.");
    }
  };

  return (
    <div className="space-y-4 mb-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-orange-500 px-1">
        <Clock size={14} className="animate-pulse" />
        <h3 className="text-[11px] font-black uppercase tracking-widest">
          Demandes en attente ({requests.length})
        </h3>
      </div>

      <div className="grid gap-3">
        {requests.map((request) => {
          const profile = profiles[request.invited_id];

          return (
            <div
              key={request.invited_id}
              className="flex items-center justify-between bg-primary/30 border border-orange-100 rounded-2xl p-3 transition-all hover:bg-primary/50"
            >
              <div className="flex items-center gap-3">
                {/* Avatar avec initiale */}
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {profile?.display_name?.charAt(0) || "?"}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-primary-foreground">
                    {profile?.display_name || "Utilisateur"}
                  </span>
                  <span className="text-[10px] text-orange-600/70 font-semibold truncate max-w-30">
                    {profile?.email}
                  </span>
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => handleAction(request.invited_id, "reject")}
                  className="p-2.5 text-slate-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all active:scale-90"
                  title="Refuser"
                >
                  <X size={20} />
                </button>

                <button
                  onClick={() => handleAction(request.invited_id, "accept")}
                  className="bg-white/70 border border-orange-200 p-2.5 font-bold text-green-500 hover:bg-green-500 hover:text-white rounded-2xl shadow-sm transition-all active:scale-90"
                  title="Accepter"
                >
                  <Check size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-2">
        <hr className="border-orange-100/50" />
      </div>
    </div>
  );
}
