/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Services
import { deleteList, fetchListById } from "@/services/crud_list";
import { fetchItems, addItem, toggleItemStatus } from "@/services/itemService";

// Composants découpés
import ItemsList from "./components/ItemsList/ItemsList";
import AddItemInput from "./components/AddItemInput/AddItemInput";
import ListHeader from "./components/ListHeader/ListHeader";
import DeleteListModal from "../Lists/components/DeleteListModal/DeleteListModal";

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listInfo, setListInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Notre fameux fetchData
  async function fetchData() {
    setLoading(true);

    // On récupère la structure de la liste
    const { data: list, error: listError } = await fetchListById(id);

    if (listError || !list) {
      toast.error("Liste introuvable");
      return navigate("/lists");
    }

    setListInfo(list);

    // On récupère les items (label, is_checked, etc.)
    const { data: itemsData, error: itemsError } = await fetchItems(id);

    if (!itemsError) {
      setItems(itemsData);
    }

    setLoading(false);
  }

  async function handleConfirmDelete() {
    const { error } = await deleteList(id);

    if (error) {
      toast.error("Impossible de supprimer la liste");
    } else {
      toast.success("Liste supprimée avec succès");
      navigate("/lists"); // Redirection immédiate
    }
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

  if (loading)
    return (
      <div className="p-20 text-center font-black animate-pulse">
        CHARGEMENT...
      </div>
    );

  return (
    <main className="max-w-md w-full mx-auto animate-in fade-in duration-300 pb-32">
      <ListHeader title={listInfo.title} iconId={listInfo.icon} listId={id} />

      <AddItemInput
        listId={id}
        onItemAdded={(newItem) => setItems([newItem, ...items])}
      />

      <ItemsList items={items} onToggle={handleToggle} />
    </main>
  );
}
