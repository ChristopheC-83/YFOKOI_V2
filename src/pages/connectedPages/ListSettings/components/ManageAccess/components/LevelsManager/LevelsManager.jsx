import React from "react";
import { updateMemberRole, rejectShareRequest } from "@/services/shareService";
import { toast } from "sonner";
import { ShieldCheck, UserMinus } from "lucide-react";
import { LIST_ROLES } from "@/constants/roles";

export default function LevelsManager({
  members,
  profiles,
  listId,
  onRefresh,
}) {
  if (members.length === 0)
    return (
      <p className="text-[10px] text-muted-foreground italic text-center py-4">
        Aucun membre pour le moment.
      </p>
    );

  const handleRoleChange = async (invitedId, newRole) => {
    try {
      const { error } = await updateMemberRole(listId, invitedId, newRole);
      if (error) throw error;
      toast.success("Droits mis à jour");
      onRefresh();
    } catch (err) {
      toast.error("Impossible de modifier les droits");
      console.error("Erreur: ", err);
    }
  };

  const handleRemove = async (invitedId) => {
    if (!confirm("Retirer ce membre de la liste ?")) return;
    try {
      const { error } = await rejectShareRequest(listId, invitedId);
      if (error) throw error;
      toast.success("Membre retiré");
      onRefresh();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
      console.error("Erreur: ", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary ">
        <ShieldCheck size={14} />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          Membres actifs
        </span>
      </div>

      <div className="grid gap-3">
        {members.map((member) => {
          const profile = profiles[member.invited_id];
          return (
            <div
              key={member.invited_id}
              className="bg-primary/20 border border-primary p-2 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">
                    {profile?.display_name || "Membre"}
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    {profile?.email}
                  </span>
                </div>
                <button
                  onClick={() => handleRemove(member.invited_id)}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                >
                  <UserMinus size={18} />
                </button>
              </div>

              {/* Sélecteur de rôle basé sur tes constantes */}
              <select
                value={member.role}
                onChange={(e) =>
                  handleRoleChange(member.invited_id, e.target.value)
                }
                className="w-full bg-background border border-border rounded-xl px-2 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
              >
                {Object.values(LIST_ROLES).map((role) => (
                  <option key={role.role} value={role.role}>
                    {role.role.toUpperCase()} - {role.can}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
