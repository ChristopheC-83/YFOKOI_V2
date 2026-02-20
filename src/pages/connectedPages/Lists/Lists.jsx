/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import CreateListModal from "./components/CreateListModal/CreateListModal";
import ListCard from "./components/ListCard/ListCard";
import { useNavigate } from "react-router-dom";
import HeaderList from "./components/HeaderList/HeaderList";
import CreateListButton from "./components/CreateListButton/CreateListButton";
import NoListFrame from "./components/NoListFrame/NoListFrame";
import { useUserStore } from "@/store/user/useUserStore";
import NotificationBadge from "@/components/notificationBadge/NotificationBadge";
import { toast } from "sonner";
import useAppStore from "@/store/useAppStore";

export default function Lists() {
  const { lists = [], loadLists, loading } = useAppStore();
  const { user, isHydrated } = useUserStore(); // On récupère l'user et l'état du store
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  async function handleRefresh  () {
    // 1. On lance l'animation
    setIsRefreshing(true);

    try {
      if (isHydrated && user) {
        // 2. On attend VRAIMENT que les données arrivent
        // Assure-toi que loadLists est bien "async" et retourne une promesse
        await loadLists();

        // 3. On ne crie victoire qu'une fois les données reçues
        toast.success("Tableau de bord actualisé");
      } else {
        toast.error("Session non prête, réessaye dans un instant");
      }
    } catch (error) {
      console.error("Erreur refresh dashboard:", error);
      toast.error("Impossible de mettre à jour");
    } finally {
      // 4. On arrête l'animation dans tous les cas
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // On ne charge les listes que si le store auth est prêt et l'user présent
    if (isHydrated && user) {
      loadLists();
    }
  }, [isHydrated, user]);

  // Sécurité affichage
  const listsLength = lists?.length || 0;

  // Si le store n'est pas encore hydraté, on affiche un loader global ou rien
  if (!isHydrated) return null;

  return (
    <div className="max-w-md w-full mx-auto pb-30 animate-in fade-in duration-700 slide-in-from-right">
      {/* HEADER : L'identité visuelle */}
      <HeaderList
        listsLength={lists.length}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* BODY : Gestion des états */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : listsLength === 0 ? (
        <NoListFrame onClick={() => setIsModalOpen(true)} />
      ) : (
        <div className="w-full flex flex-col justify-between gap-3">
          <CreateListButton
            textButton={"Nouvelle liste"}
            onClick={() => setIsModalOpen(true)}
          />

          {lists.map((list) => {
            const isOwner = list.owner_id === user?.id;
            const shares = list.list_shares || [];

            // 🛡️ NOUVEAU SYSTÈME : On va chercher le nom dans la jointure Supabase
            // On teste .profiles (nom standard) ou .owner (selon ta requête SQL)
            const ownerData = list.profiles || list.owner;
            const ownerDisplayName = isOwner
              ? null
              : ownerData?.display_name || "Auteur inconnu";

            // 1. Je suis invité en attente
            const iAmWaiting =
              !isOwner &&
              shares.some(
                (share) =>
                  share.invited_id === user?.id && share.status === "pending",
              );

            // 2. Je suis proprio et j'ai des demandes en attente
            const hasPendingGuests =
              isOwner && shares.some((share) => share.status === "pending");

            return (
              <div key={list.id} className="relative group">
                {/* Overlay pour bloquer l'accès si en attente */}
                <div
                  className={`transition-all duration-300 ${
                    iAmWaiting
                      ? "opacity-50 grayscale pointer-events-none"
                      : "cursor-pointer active:scale-[0.98]"
                  }`}
                  onClick={() => !iAmWaiting && navigate(`/list/${list.id}`)}
                >
                  <ListCard list={list} ownerDisplayName={ownerDisplayName} />
                </div>

                {/* Badge Invité : En attente */}
                {iAmWaiting && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-orange-500/90 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-xl border-2 border-white animate-pulse tracking-wider">
                      En attente de validation
                    </div>
                  </div>
                )}

                {/* Badge Proprio : Action requise */}
                {hasPendingGuests && <NotificationBadge />}
              </div>
            );
          })}
        </div>
      )}

      <CreateListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
