/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

// Stores
import useAppStore from "@/store/useAppStore";
import { useUserStore } from "@/store/user/useUserStore";

// Services
import {
  toggleItemStatus,
  deleteItem,
  deleteCheckedItems,
  syncAndStoreItems,
  refreshListAndItems,
} from "@/services/itemService";
import { leaveList } from "@/services/shareService";
import { fetchListById } from "@/services/crud_list";

// Composants
import ItemsList from "./components/ItemsList/ItemsList";
import AddItemInput from "./components/AddItemInput/AddItemInput";
import ListHeader from "./components/ListHeader/ListHeader";
import { supabase } from "@/lib/supabase";

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();

  // --- LE STORE EST NOTRE SOURCE DE VÉRITÉ ---
  const items = useAppStore(useShallow((state) => state.items?.[id] || []));

  const listInfo = useAppStore(
    useShallow((state) => state.lists.find((list) => list.id === id) || null),
  );

  const [isInitialLoading, setIsInitialLoading] = useState(!listInfo);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- CHARGEMENT & SYNCHRO ---
  // useEffect(() => {
  //   let isMounted = true;

  //   async function init() {
  //     if (!id) return;
  //     try {
  //       const { data: freshList, error } = await fetchListById(id);

  //       // CAS CRITIQUE : La liste n'existe plus (supprimée par le proprio)
  //       // fetchListById renvoie souvent data: null sans forcément lever une exception
  //       if (isMounted && (!freshList || error)) {
  //         toast.error("Cette liste n'existe plus ou vous n'y avez plus accès.");
  //         useAppStore.getState().removeListFromStore(id); // On nettoie le store local
  //         navigate("/lists", { replace: true }); // On dégage l'invité
  //         return;
  //       }

  //       if (isMounted && freshList) {
  //         useAppStore.getState().updateListInStore(id, freshList);
  //       }

  //       await syncAndStoreItems(id);
  //     } catch (err) {
  //       console.error("Erreur d'initialisation :", err);
  //     } finally {
  //       if (isMounted) setIsInitialLoading(false);
  //     }
  //   }

  //   init();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [id, navigate]); // Ajoute navigate aux dépendances

  useEffect(() => {
    if (!id) return;

    // On rafraîchit à l'ouverture, c'est la sécurité.
    refreshListAndItems(id);

    // On ouvre UNE SEULE antenne pour TOUT ce qui touche aux items
    const channel = supabase
      .channel(`ma-liste-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        (payload) => {
          // Dès qu'UN item bouge (n'importe lequel), on rafraîchit tout.
          // C'est simple, c'est brutal, ça marche.
          console.log("Mouvement détecté !");
          refreshListAndItems(id);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]); // On garde les dépendances au strict minimum//   if (!id) return;

  //   // 1. Refresh initial (La base)
  //   refreshListAndItems(id);

  //   // 2. Création d'un canal UNIQUE pour cette page
  //   const channel = supabase
  //     .channel(`global-sync-${id}`)
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "items" }, // On écoute TOUT sans filtre pour tester
  //       (payload) => {
  //         console.log("🔔 REALTIME ITEM :", payload.eventType);
  //         refreshListAndItems(id);
  //       },
  //     )
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "DELETE",
  //         schema: "public",
  //         table: "lists",
  //         filter: `id=eq.${id}`,
  //       },
  //       () => {
  //         console.log("🚨 REALTIME DELETE LISTE");
  //         navigate("/lists", { replace: true });
  //       },
  //     )
  //     .subscribe((status) => {
  //       console.log("📡 STATUS CONNEXION :", status);
  //     });

  //   // 3. NETTOYAGE (Crucial pour éviter le blocage)
  //   return () => {
  //     console.log("🔌 Déconnexion du canal");
  //     supabase.removeChannel(channel);
  //   };
  // }, [id, navigate]);

  // --- LOGIQUE DES ROLES ---
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

  // --- ACTIONS ---
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
      toast.success("Suppression effectuée");
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
    try {
      const result = await refreshListAndItems(id);

      if (result?.deleted) {
        toast.error("La liste n'existe plus");
        navigate("/lists");
        return;
      }

      toast.success("À jour");
    } catch (err) {
      toast.error("Erreur de synchronisation");
    } finally {
      setIsRefreshing(false);
    }
  };

  // --- RENDU ---
  if (isInitialLoading) {
    return (
      <div className="p-20 text-center font-black animate-pulse text-slate-400">
        SYNCHRONISATION...
      </div>
    );
  }

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
        items={items}
        onToggle={handleToggle}
        onDelete={handleDeleteItem}
        onClearCompleted={handleClearCompleted}
        userRole={userRole}
        currentUserId={user?.id}
        readOnly={userRole === "read"}
      />
    </main>
  );
}
