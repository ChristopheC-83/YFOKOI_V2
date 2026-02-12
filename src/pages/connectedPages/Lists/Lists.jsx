/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import CreateListModal from "./components/CreateListModal/CreateListModal";
import ListCard from "./components/ListCard/ListCard";
import { useNavigate } from "react-router-dom";
import HeaderList from "./components/HeaderList/HeaderList";
import CreateListButton from "./components/CreateListButton/CreateListButton";
import NoListFrame from "./components/NoListFrame/NoListFrame";
import useListStore from "@/store/lists/useListStore";
import { ModalJoinList } from "./components/ModalJoinList/ModalJoinList";

export default function Lists() {
  const { lists = [], loadLists, loading } = useListStore(); // Force le tableau vide ici par sécurité
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadLists();
  }, []);

  // Utilisation de l'optional chaining pour éviter le crash
  const listsLength = lists?.length || 0;

  return (
    <div className="max-w-md w-full mx-auto py-8 animate-in fade-in duration-700 slide-in-from-right">
      <HeaderList listsLength={listsLength} />

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : listsLength === 0 ? ( // On utilise listsLength qu'on a sécurisé plus haut
        <NoListFrame onClick={() => setIsModalOpen(true)} />
      ) : (
        <div className="w-full flex flex-col gap-3">
          <CreateListButton
            textButton={"Créer une nouvelle liste"}
            onClick={() => setIsModalOpen(true)}
          />

          {/* Ajout du bouton rejoindre ici pour que l'user puisse l'utiliser ! */}
          {/* <ModalJoinList refreshLists={loadLists} /> */}

          {lists.map((list) => {
            // Sécurité : list_shares peut être undefined ou null
            const isPending = list.list_shares?.some(
              (share) => share.status === "pending",
            );

            return (
              <div key={list.id} className="relative">
                <div
                  className={`transition-all ${isPending ? "opacity-60 grayscale pointer-events-none" : "cursor-pointer"}`}
                  onClick={() => !isPending && navigate(`/list/${list.id}`)}
                >
                  <ListCard list={list} />
                </div>

                {isPending && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-orange-500/90 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg border-2 border-white animate-pulse">
                      En attente de validation
                    </div>
                  </div>
                )}
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
