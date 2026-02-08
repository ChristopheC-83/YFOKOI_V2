import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchListById, deleteList } from "@/services/crud_list";
import DeleteListModal from "../Lists/components/DeleteListModal/DeleteListModal";
import { toast } from "sonner";
import HeaderListSettings from "./components/HeaderListSettings/HeaderListSettings";
import EditList from "./components/EditList/EditList";
import Sharing from "./components/Sharing/Sharing";
import DeleteListButton from "./components/DeleteListButton/DeleteListButton";

export default function ListSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    async function loadList() {
      const { data } = await fetchListById(id);
      if (data) setList(data);
    }
    loadList();
  }, [id]);

  if (!list) return null;

  return (
    <main className="mmax-w-md w-full mx-auto pb-40 animate-in fade-in duration-700 slide-in-from-right ">
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
        onConfirm={async () => {
          const { error } = await deleteList(id);
          if (!error) {
            toast.success("Liste supprimée");
            navigate("/lists");
          }
        }}
        listTitle={list.title}
      />
    </main>
  );
}
