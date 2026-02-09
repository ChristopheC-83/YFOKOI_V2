import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchListById, deleteList } from "@/services/crud_list";
import DeleteListModal from "../Lists/components/DeleteListModal/DeleteListModal";
import { toast } from "sonner";
import HeaderListSettings from "./components/HeaderListSettings/HeaderListSettings";
import EditList from "./components/EditList/EditList";
import Sharing from "./components/Sharing/Sharing";
import DeleteListButton from "./components/DeleteListButton/DeleteListButton";
import useListStore from "@/store/lists/useListStore";

export default function ListSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const removeListFromStore = useListStore(
    (state) => state.removeListFromStore,
  );

  useEffect(() => {
    async function loadList() {
      const { data } = await fetchListById(id);
      if (data) setList(data);
    }
    loadList();
  }, [id]);

  async function handleDeleteConfirm() {
    const { error } = await deleteList(id);

    if (!error) {
      // 3. ON NETTOIE LE STORE IMMÉDIATEMENT
      removeListFromStore(id);

      toast.success("Liste supprimée");
      navigate("/lists"); // 4. On redirige vers un accueil déjà à jour
    } else {
      toast.error("Erreur lors de la suppression");
    }
  }

  if (!list) return null;

  return (
    <main className="mmax-w-md w-full mx-auto pb-40 animate-in fade-in duration-300 slide-in-from-right ">
      {/* Header simplifié pour les réglages */}
      <HeaderListSettings onClick={() => navigate(-1)} />

      <div className="space-y-6">
        {/* SECTION : ÉDITION (NOM / ICÔNE) */}
        <EditList list={list} />

        {/* SECTION : PARTAGE (Placeholder pour tes futurs besoins) */}
        <Sharing list={list} />

        {/* SECTION : DANGER ZONE */}
        <DeleteListButton onClick={() => setIsDeleteModalOpen(true)} />
      </div>
      <DeleteListModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm} // On utilise la nouvelle fonction
        listTitle={list.title}
      />
    </main>
  );
}
