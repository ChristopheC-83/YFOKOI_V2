import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteList } from "@/services/crud_list";
import DeleteListModal from "../Lists/components/DeleteListModal/DeleteListModal";
import { toast } from "sonner";
import HeaderListSettings from "./components/HeaderListSettings/HeaderListSettings";
import EditList from "./components/EditList/EditList";
import Sharing from "./components/Sharing/Sharing";
import DeleteListButton from "./components/DeleteListButton/DeleteListButton";
import useListStore from "@/store/lists/useListStore";
import ManageAccess from "./components/ManageAccess/ManageAccess";
import { X } from "lucide-react";
import { useUserStore } from "@/store/user/useUserStore";

export default function ListSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();

  // On récupère la liste depuis le store
  const list = useListStore((state) => state.getListById(id));
  const { refreshList, removeListFromStore } = useListStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // On initialise à TRUE pour bloquer l'affichage de "Liste introuvable" trop tôt
  const [loading, setLoading] = useState(true);

  //  accés seulement au prprio
  const isOwner = list?.owner_id === user?.id;

  const handleRefreshSettings = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await refreshList(id);
    } catch (err) {
      console.error("Erreur de chargement", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Si le chargement est fini, que la liste existe, mais que le user n'est pas le boss
    if (!loading && list && !isOwner) {
      toast.error("Zone réservée au propriétaire de la liste.");
      navigate(`/list/${id}`, { replace: true });
    }
  }, [loading, list, isOwner, id, navigate]);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        await refreshList(id);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, refreshList]);

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

  // 1. ÉTAT DE CHARGEMENT : On attend l'API
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Synchronisation...
        </p>
      </div>
    );
  }

  // 2. ÉTAT D'ERREUR : L'API a répondu mais la liste n'est toujours pas là
  if (!list) {
    return (
      <div className="p-12 text-center animate-in fade-in duration-500">
        <div className="bg-red-50 text-red-500 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <X size={32} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Liste introuvable</h2>
        <p className="text-sm text-slate-500 mb-6">
          Elle a peut-être été supprimée ou vous n'y avez plus accès.
        </p>
        <button
          onClick={() => navigate("/lists")}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          Retourner à l'accueil
        </button>
      </div>
    );
  }

  // 3. ÉTAT NOMINAL : La donnée est prête

  return (
    <main className="max-w-md w-full mx-auto pb-40 animate-in fade-in duration-300 slide-in-from-right ">
      {/* Header simplifié pour les réglages */}
      <HeaderListSettings onClick={() => navigate(-1)} onRefresh={handleRefreshSettings} isRefreshing={loading} />

      <div className="space-y-6">
        {/* SECTION : ÉDITION (NOM / ICÔNE) */}
        <EditList list={list} />

        {/* SECTION : PARTAGE PAR CODE */}
        <Sharing list={list} />

        {/* SECTION : MANAGEMENT DES PARTAGES */}
        <ManageAccess list={list} onRefresh={() => refreshList(list.id)} />

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
