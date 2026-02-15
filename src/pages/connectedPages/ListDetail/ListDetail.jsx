/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Services
import { fetchListById } from "@/services/crud_list";
import {
  fetchItems,
  toggleItemStatus,
  deleteItem,
  deleteCheckedItems,
} from "@/services/itemService";

// Composants découpés
import ItemsList from "./components/ItemsList/ItemsList";
import AddItemInput from "./components/AddItemInput/AddItemInput";
import ListHeader from "./components/ListHeader/ListHeader";
import { useUserStore } from "@/store/user/useUserStore";
import { leaveList } from "@/services/shareService";

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [listInfo, setListInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  const isOwner = listInfo?.owner_id === user?.id;
  const hasPendingRequests = !!(
    isOwner &&
    listInfo?.list_shares?.some((share) => share.status === "pending")
  );
  // Dans ListDetail.jsx, après avoir récupéré listInfo et user
  const userMemberInfo = listInfo?.list_shares?.find(
    (share) => share.invited_id === user?.id,
  );

  // Le rôle est soit celui du partage, soit 'owner' si c'est le créateur
  const userRole = isOwner
    ? "owner"
    : userMemberInfo?.status === "accepted"
      ? userMemberInfo.role
      : null;

  // Définition des permissions (Capacités)
  const canEdit = ["owner", "modo", "edit"].includes(userRole);
  const canManage = ["owner", "modo"].includes(userRole);
  const isReadOnly = userRole === "read";

 async function fetchData() {
   setLoading(true);

   // 1. On vérifie l'existence de la liste (Le Parent)
   const { data: list, error: listError } = await fetchListById(id);

   // Si erreur ou liste supprimée par le Owner
   if (listError || !list) {
     toast.error("Cette liste n'existe plus.");
     navigate("/lists", { replace: true });
     return false; // ❌ ÉCHEC
   }

   setListInfo(list);

   // 2. On récupère les items (Les Enfants)
   const { data: itemsData, error: itemsError } = await fetchItems(id);

   if (itemsError) {
     toast.error("Erreur de synchronisation des articles");
     setItems([]);
     setLoading(false);
     return false; // ❌ ÉCHEC
   }

   setItems(itemsData || []);
   setLoading(false);
   return true;
 }

  useEffect(() => {
    fetchData();
  }, [id]);

  // Actions métier
  async function handleToggle(item) {
    const oldItems = [...items];
    // UI Optimiste
    setItems(
      items.map((i) =>
        i.id === item.id ? { ...i, is_checked: !i.is_checked } : i,
      ),
    );

    const { error } = await toggleItemStatus(item.id, item.is_checked);
    if (error) {
      toast.error("Erreur réseau");
      setItems(oldItems);
    }
  }

  async function handleDeleteItem(itemId) {
    // 1. On l'enlève de l'écran (UI Optimiste)
    setItems(items.filter((i) => i.id !== itemId));

    // 2. ON ENVOIE L'ORDRE (C'est ici que ça doit coincer)
    const { error } = await deleteItem(itemId); // <--- VÉRIFIE LE AWAIT

    if (error) {
      console.error("ERREUR SUPABASE:", error);
      toast.error("Échec de la suppression en base");
      // On le remet si ça a échoué pour ne pas mentir à l'utilisateur
      fetchData();
    }
  }

  async function handleClearCompleted() {
    // 1. On demande d'abord, on agit après
    const hasConfirmed = window.confirm(
      "Es-tu sûr de vouloir supprimer définitivement tous les articles cochés ?",
    );

    if (!hasConfirmed) return; // L'utilisateur a eu peur, on arrête tout.

    // 2. UI Optimiste : on nettoie l'écran tout de suite
    const previousItems = [...items];
    setItems(items.filter((i) => !i.is_checked));

    // 3. Appel API (Le muscle)
    const { error } = await deleteCheckedItems(id);

    if (error) {
      toast.error("Erreur lors du nettoyage en base de données");
      setItems(previousItems); // Rollback : on remet les items si la DB a dit non
    } else {
      toast.success("Panier vidé !");
    }
  }

  const handleLeave = async () => {
    if (window.confirm("Quitter cette liste définitivement ?")) {
      const { error } = await leaveList(id, user.id);
      if (!error) navigate("/lists", { replace: true });
    }
  };

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      // On appelle la fonction qui vérifie TOUT (Liste + Items)
      // Elle gère déjà la redirection vers /lists si la liste est morte
      const success = await fetchData(true);
      if (success) {
        toast.success("Liste actualisée");
      }
    } catch (err) {
      console.error("DEBUG REFRESH - Error:", err);
      toast.error("Synchro impossible");
    } finally {
      setIsRefreshing(false);
    }
  }

  if (loading)
    return (
      <div className="p-20 text-center font-black animate-pulse">
        CHARGEMENT...
      </div>
    );

  return (
    <main className="max-w-md w-full mx-auto animate-in fade-in duration-300 slide-in-from-right  pb-32">
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
      {canEdit && (
        <AddItemInput
          listId={id}
          onItemAdded={(newItem) => setItems([newItem, ...items])}
        />
      )}

      <ItemsList
        items={items}
        onToggle={handleToggle} // On passe la fonction brute
        onDelete={handleDeleteItem}
        onClearCompleted={handleClearCompleted}
        userRole={userRole}
        currentUserId={user?.id} // Obligatoire pour la comparaison
        readOnly={userRole === "read"}
      />
    </main>
  );
}
