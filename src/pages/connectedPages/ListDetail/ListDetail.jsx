/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Stores
import useAppStore from "@/store/useAppStore";
import { useUserStore } from "@/store/user/useUserStore";

// Services
import {
  toggleItemStatus,
  deleteItem,
  deleteCheckedItems,
  syncAndStoreItems,
} from "@/services/itemService";
import { leaveList } from "@/services/shareService";

// Composants
import ItemsList from "./components/ItemsList/ItemsList";
import AddItemInput from "./components/AddItemInput/AddItemInput";
import ListHeader from "./components/ListHeader/ListHeader";
import { fetchListById } from "@/services/crud_list";

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();

  // --- LE STORE EST NOTRE SOURCE DE VÉRITÉ ---
  // 1. On sécurise l'accès aux items
  const items = useAppStore((state) => {
    // Si state.items n'est pas un objet (ex: null, undefined ou vieux tableau), on évite le crash
    if (!state.items || Array.isArray(state.items)) return [];
    return state.items[id] || [];
  });

  // 2. On sécurise l'appel à la fonction getListById
  const listInfo = useAppStore((state) => {
    // On vérifie que la fonction existe avant de l'appeler
    if (typeof state.getListById === "function") {
      return state.getListById(id);
    }
    // Sinon on cherche à la main en secours pour éviter le crash
    return state.lists?.find((l) => l.id === id) || null;
  });
  const links = useAppStore((state) => state.links);
  const [isInitialLoading, setIsInitialLoading] = useState(!listInfo);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- CHARGEMENT & SYNCHRO ---
  useEffect(() => {
    async function init() {
      if (!id) return;

      // 1. On affiche ce qu'on a en cache (immédiat)
      // listInfo est déjà récupéré via le store au début du composant

      try {
        // 2. On lance la synchro DB -> Store en arrière-plan
        // Cette fonction va fetcher la liste ET les items
        const { data: freshList } = await fetchListById(id);

        if (freshList) {
          // On met à jour la liste dans le store (ce qui rafraîchira les rôles)
          useAppStore.getState().updateListInStore(id, freshList);
        }

        await syncAndStoreItems(id);
      } catch (err) {
        console.error("Erreur de rafraîchissement des droits:", err);
      } finally {
        setIsInitialLoading(false);
      }
    }

    init();
  }, [id]);

  // --- LOGIQUE DES ROLES ---
  // On récupère le rôle via les shares stockées dans listInfo
  const isOwner = listInfo?.owner_id === user?.id;
  const userMemberInfo = listInfo?.list_shares?.find(
    (s) => s.invited_id === user?.id,
  );
  const userRole = isOwner
    ? "owner"
    : userMemberInfo?.status === "accepted"
      ? userMemberInfo.role
      : null;

  const canEdit = ["owner", "modo", "edit"].includes(userRole);
  const hasPendingRequests =
    isOwner && listInfo?.list_shares?.some((s) => s.status === "pending");


  // --- ACTIONS (APPELENT LES SERVICES QUI METTENT À JOUR LE STORE) ---
  const handleToggle = async (item) => {
    try {
      await toggleItemStatus(item);
    } catch (err) {
      toast.error("Échec de la mise à jour");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId, id);
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleClearCompleted = async () => {
    if (window.confirm("Supprimer définitivement les articles cochés ?")) {
      try {
        await deleteCheckedItems(id);
        toast.success("Nettoyage effectué");
      } catch (err) {
        toast.error("Erreur lors du nettoyage");
      }
    }
  };

  const handleLeave = async () => {
    if (window.confirm("Quitter cette liste ?")) {
      const { error } = await leaveList(id, user.id);
      if (!error) navigate("/lists");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await syncAndStoreItems(id);
    setIsRefreshing(false);
    toast.success("À jour");
  };

  // console.log("Ma recherche de membre :", {
  //   monId: user?.id,
  //   lesShares: listInfo?.list_shares,
  //   trouvé: userMemberInfo,
  // });

  // --- RENDU ---
  if (isInitialLoading) {
    return (
      <div className="p-20 text-center font-black animate-pulse text-slate-400">
        SYNCHRONISATION...
      </div>
    );
  }

  // Si après le chargement on n'a toujours pas de listInfo
  if (!listInfo) return null;

  return (
    <main className="max-w-md w-full mx-auto animate-in fade-in duration-300 slide-in-from-right pb-32">
      <ListHeader
        title={listInfo.title}
        iconId={listInfo.icon}
        listId={id}
        hasNotification={hasPendingRequests}
        isOwner={isOwner}
        onLeave={handleLeave}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {canEdit && <AddItemInput listId={id} />}

      <ItemsList
        items={items} // Vient directement du store, réactif 100%
        onToggle={handleToggle}
        onDelete={handleDeleteItem}
        onClearCompleted={handleClearCompleted}
        userRole={userRole}
        currentUserId={user?.id}
        links={links} // Pour afficher "par Vanessa"
        readOnly={userRole === "read"}
      />
    </main>
  );
}
